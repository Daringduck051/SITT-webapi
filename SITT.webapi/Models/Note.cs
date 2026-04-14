using SITT.Models;

public class Note
{
    public int Id{ get; set; }
    public int Count { get; set; }
    public string Name { get; set; } = string.Empty;
    public int UserId {get; set;}
    public User? User {get; set;}
}