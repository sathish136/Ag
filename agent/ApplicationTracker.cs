using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

namespace TeamSpy.Agent
{
    public class ApplicationTracker
    {
        private System.Threading.Timer? _timer;
        private string _lastWindowTitle = string.Empty;
        private string _lastProcessName = string.Empty;
        private DateTime _startTime;
        private readonly ApiClient _apiClient;

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

        public ApplicationTracker(ApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public void Start()
        {
            Console.WriteLine("Starting Application Tracker...");
            _timer = new System.Threading.Timer(Track, null, 0, 1000); // Check every second
        }

        private void Track(object? state)
        {
            try
            {
                IntPtr handle = GetForegroundWindow();
                if (handle == IntPtr.Zero) return;

                GetWindowThreadProcessId(handle, out uint processId);
                if (processId == 0) return;

                Process p = Process.GetProcessById((int)processId);
                if (p == null) return;

                string currentWindowTitle = p.MainWindowTitle;
                if (string.IsNullOrEmpty(currentWindowTitle))
                {
                    currentWindowTitle = p.ProcessName;
                }

                if (currentWindowTitle != _lastWindowTitle)
                {
                    LogApplicationUsage();

                    _lastWindowTitle = currentWindowTitle;
                    _lastProcessName = p.ProcessName;
                    _startTime = DateTime.Now;

                    Console.WriteLine($"{DateTime.Now}: Switched to '{p.ProcessName}' - '{currentWindowTitle}'");
                }
            }
            catch (Exception) { /* Ignore errors */ }
        }

        private void LogApplicationUsage()
        {
            if (_startTime == default || string.IsNullOrEmpty(_lastWindowTitle)) return;

            var duration = (int)(DateTime.Now - _startTime).TotalSeconds;
            if (duration > 0)
            {
                 _apiClient.SendDataAsync("appusage", new
                {
                    processName = _lastProcessName,
                    windowTitle = _lastWindowTitle,
                    usageDuration = duration,
                    timestamp = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                });
            }
        }

        public void Stop()
        {
            _timer?.Change(Timeout.Infinite, 0);
            LogApplicationUsage(); // Log usage for the last active application
            Console.WriteLine("Stopped Application Tracker.");
        }
    }
}
