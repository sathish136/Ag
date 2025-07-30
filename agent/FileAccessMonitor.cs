using System;
using System.IO;
using System.Linq;
using System.Threading;

namespace TeamSpy.Agent
{
    public class FileAccessMonitor
    {
        private FileSystemWatcher? _watcher;
        private System.Threading.Timer? _usbTimer;
        private string[] _initialDrives = new string[0];
        private readonly ApiClient _apiClient;
        private readonly string _agentDirectory;

        public FileAccessMonitor(ApiClient apiClient)
        {
            _apiClient = apiClient;

            // Find the project root directory by looking for the .csproj file
            string? currentDir = AppDomain.CurrentDomain.BaseDirectory;
            while (currentDir != null && !Directory.GetFiles(currentDir, "*.csproj").Any())
            {
                currentDir = Directory.GetParent(currentDir)?.FullName;
            }
            _agentDirectory = currentDir ?? AppDomain.CurrentDomain.BaseDirectory;
        }

        public void Start()
        {
            Console.WriteLine("Starting File Access Monitor...");
            string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            
            string userProfile = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            _watcher = new FileSystemWatcher(userProfile)
            {
                NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.DirectoryName,
                IncludeSubdirectories = true,
                EnableRaisingEvents = true
            };

            _watcher.Changed += OnFileChanged;
            _watcher.Created += OnFileCreated;
            _watcher.Deleted += OnFileDeleted;
            _watcher.Renamed += OnFileRenamed;

            _initialDrives = DriveInfo.GetDrives().Select(d => d.Name).ToArray();
            _usbTimer = new System.Threading.Timer(DetectUsbDrives, null, 0, 5000); // Check every 5 seconds
        }

        private void DetectUsbDrives(object? state)
        {
            try
            {
                string[] currentDrives = DriveInfo.GetDrives().Select(d => d.Name).ToArray();
                var newDrives = currentDrives.Except(_initialDrives).ToList();

                foreach (var drive in newDrives)
                {
                    Console.WriteLine($"{DateTime.Now}: USB Drive Detected: {drive}");
                    _ = _apiClient.SendDataAsync("fileaccess", new 
                    {
                        Timestamp = DateTime.Now, 
                        EventType = "USB_Detected", 
                        FilePath = drive, 
                        Details = (string?)null 
                    });
                }

                _initialDrives = currentDrives;
            }
            catch (Exception) { /* Ignore errors */ }
        }

        public void Stop()
        {
            _watcher?.Dispose();
            _usbTimer?.Change(Timeout.Infinite, 0);
            Console.WriteLine("Stopped File Access Monitor.");
        }

        private void OnFileChanged(object sender, FileSystemEventArgs e)
        {
            if (IsAgentDirectory(e.FullPath)) return;
            _ = _apiClient.SendDataAsync("fileaccess", new { Timestamp = DateTime.Now, EventType = "Changed", FilePath = e.FullPath, Details = (string?)null });
        }

        private void OnFileCreated(object sender, FileSystemEventArgs e)
        {
            if (IsAgentDirectory(e.FullPath)) return;
            _ = _apiClient.SendDataAsync("fileaccess", new { Timestamp = DateTime.Now, EventType = "Created", FilePath = e.FullPath, Details = (string?)null });
        }

        private void OnFileDeleted(object sender, FileSystemEventArgs e)
        {
            if (IsAgentDirectory(e.FullPath)) return;
            _ = _apiClient.SendDataAsync("fileaccess", new { Timestamp = DateTime.Now, EventType = "Deleted", FilePath = e.FullPath, Details = (string?)null });
        }

        private void OnFileRenamed(object sender, RenamedEventArgs e)
        {
            if (IsAgentDirectory(e.FullPath)) return;
            _ = _apiClient.SendDataAsync("fileaccess", new { Timestamp = DateTime.Now, EventType = "Renamed", FilePath = e.FullPath, Details = $"From: {e.OldFullPath}" });
        }

        private bool IsAgentDirectory(string? path)
        {
            return !string.IsNullOrEmpty(path) && path.StartsWith(_agentDirectory, StringComparison.OrdinalIgnoreCase);
        }


    }
}
