import { Buffer } from "node:buffer";

export class SimpleFin {
    private setupToken: string;

    constructor(setupToken: string) {
        this.setupToken = setupToken;
    };

    static async fromSetupToken(setupToken: string): Promise<SimpleFin> {
        const claimUrl = Buffer.from(setupToken, "base64").toString("utf-8");
        
        let result: Response;
        try {
            result = await fetch(claimUrl, { method: "POST" });
        } catch (err) {
            throw new Error(`Failed to reach the SimpleFIN Bridge: ${(err as Error).message}`);
        }

        if (!result.ok) {
            throw new Error(`Failed to claim access URL: ${result.status} ${result.statusText}`);
        }

        if (!result.ok) {
            throw new Error("LOL DOESN'T WORK. CREATE BETTER ERROR MESSAGES");
        }

        const accessUrl = (await result.text()).trim();

        return new SimpleFin(accessUrl);
    }
}
