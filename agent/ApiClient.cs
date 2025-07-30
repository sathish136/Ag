using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TeamSpy.Agent
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
                private const string BaseUrl = "https://a64d656d-096c-4409-84ad-fec3da239b5b-00-1au3m59282s70.worf.replit.dev/api/";

        public ApiClient()
        {
            _httpClient = new HttpClient();
            // Some APIs reject requests without a standard User-Agent header.
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");
        }

        public async Task SendDataAsync(string endpoint, object data)
        { 
            try
            {
                var options = new JsonSerializerOptions { WriteIndented = true };
                var jsonData = JsonSerializer.Serialize(data, options);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(BaseUrl + endpoint, content);

                if (response.IsSuccessStatusCode)
                { 
                    Console.WriteLine($"Successfully sent data to {endpoint}");
                }
                else
                {
                    Console.WriteLine($"Failed to send data to {endpoint}. Status code: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending data to API: {ex.Message}");
            }
        }
    }
}
