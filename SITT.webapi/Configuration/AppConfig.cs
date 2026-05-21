namespace SITT.Config;

public class AppConfig
{
    public string? ApiKey { get; set; }
    public EmailSettings? EmailSettings { get; set; }
}

public class EmailSettings
{
    public string? FromAddress { get; set; }
    public string? ToAddress { get; set; }
}