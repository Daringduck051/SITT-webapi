namespace SITT.Extensions;

using System.Security.Claims;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        // Check for the long URI first, then the short 'sub'
        var claim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null) return 0;

        return int.TryParse(claim.Value, out var id) ? id : 0;
    }
}