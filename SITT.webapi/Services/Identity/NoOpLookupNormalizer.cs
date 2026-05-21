namespace SITT.Services.Identity;
using Microsoft.AspNetCore.Identity;

public class NoOpLookupNormalizer : ILookupNormalizer
{
    public string? NormalizeEmail(string? email) => email;
    public string? NormalizeName(string? name) => name;
};