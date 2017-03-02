export class JwtPayload
{
	public iss: string;
	public sub: string;
	public aud: string;
	public exp: string;
	public nbf: string;
	public iat: string;
	public jti: string;
	public userEmail: string;
	public userId: string;
	public userSecurityClaims: Array<string>;
	public tokenType: string;
}