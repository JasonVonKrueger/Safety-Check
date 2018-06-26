<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using MySql.Data.MySqlClient;

public class Handler : IHttpHandler 
{
    private string _connectionString = "Persist Security Info=False;Database=<db>;server=<server>;Port=3306;User Id=<username>;pwd=<passwd>";
    
    public void ProcessRequest (HttpContext context) 
    {
        context.Response.ContentType = "text/plain";        
        string msg = HttpUtility.UrlDecode(context.Request.Form["msg"]);
                
        if (isPhish(msg))
            context.Response.Write("Y");
        else
            context.Response.Write("N");        
    }
    
    public bool isPhish(string msg)
    {
        bool returnVal = false;

        MySqlConnection con = new MySqlConnection(_connectionString);
        con.Open();

        string sql = "select url from safety_check";

        MySqlCommand cmd = new MySqlCommand(sql, con);
        MySqlDataReader dr = cmd.ExecuteReader();

        if (dr.HasRows)
        {
            while (dr.Read())
            {
                if (msg.Contains(dr["url"].ToString()))
                {
                    returnVal = true;
                    break;
                }
            }
        }

        con.Close();        
        
        return returnVal;
    }
    
    public string GetURLs()
    {
        string returnVal = null;
        MySqlConnection con = new MySqlConnection(_connectionString);
        con.Open();
        
        string sql = "select url from safety_check";
        
        MySqlCommand cmd = new MySqlCommand(sql, con);
        MySqlDataReader dr = cmd.ExecuteReader();

        if (dr.HasRows)
        {
            returnVal = "";
        }        

        con.Close();
        return returnVal;   
    }
    
    public void AddURL(string url,string addedby)
    {
        MySqlConnection con = new MySqlConnection(_connectionString);
        con.Open();

        string sql = "INSERT INTO safety_check (url,added_by) VALUES ('" + url + "','" + addedby + "')";
        MySqlCommand cmd = new MySqlCommand(sql, con);
        cmd.ExecuteNonQuery();        

        con.Close();        
    }
 
    public bool IsReusable 
    {
        get 
        {
            return false;
        }
    }

}