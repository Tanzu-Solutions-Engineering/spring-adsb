using System;

namespace aircraft_monitor_dotnet
{
  class PositionData
  {
    public long Altitude { get; set; }

    public String flight { get; set; }

    public double Lon { get; set; }

    public double Lat { set; get; }

    public long timestamp { set; get; }

    public double Track { get; set; }

    public double Speed { get; set; }
    public String Hex { get; set; }
    public String Squawk { get; set; }
    public double Seen { get; set; }

    public double Seen_pos { get; set; }
    public long Messages { get; set; }
    public String Category { get; set; }
    public long Vert_rate { get; set; }
    public double Rssi { get; set; }

    public String GroundStationName { get; set; }
  }

}