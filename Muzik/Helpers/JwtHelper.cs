using System.IdentityModel.Tokens.Jwt;

public static class JwtHelper
{
    public static int GetUserIdFromToken(string token)
    {
        Console.WriteLine($"🔍 Raw Token: {token}");

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        var userIdClaim = jwtToken.Claims.FirstOrDefault(c =>
            c.Type == JwtRegisteredClaimNames.Sub ||   // Standard JWT sub claim
            c.Type == JwtRegisteredClaimNames.NameId ||  // Your current token format
            c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new Exception("Cannot get user id from token");
        }

        Console.WriteLine($"✅ Extracted User ID: {userIdClaim}");
        return int.Parse(userIdClaim);
    }
}
