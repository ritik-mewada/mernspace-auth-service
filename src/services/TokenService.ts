// import fs from "fs";
// import path from "path";
import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { Repository } from "typeorm";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";

export class TokenService {
    constructor(private refereshTokenRepository: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;
        // let privateKey: Buffer;

        if (!Config.PRIVATE_KEY) {
            const error = createHttpError(500, "SECRET_KEY is not set");
            throw error;
        }
        try {
            privateKey = Config.PRIVATE_KEY;
            // privateKey = fs.readFileSync(
            // path.join(__dirname, "../../certs/private.pem"),
            // );
        } catch {
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

        const newRefreshToken = await this.refereshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        return await this.refereshTokenRepository.delete({ id: tokenId });
    }
}
