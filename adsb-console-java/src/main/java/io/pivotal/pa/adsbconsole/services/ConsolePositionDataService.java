package io.pivotal.pa.adsbconsole.services;

import io.pivotal.pa.positiondata.PositionData;
import io.pivotal.pa.positiondata.PositionDataService;
import org.json.simple.JSONObject;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ConsolePositionDataService implements PositionDataService {

    private long tsLastMeasure;
    private long numberOfEventsReceived;

    public ConsolePositionDataService() {
        getPositionData(System.currentTimeMillis(), null, null, null);
        tsLastMeasure = System.currentTimeMillis();
    }

    @Override
    public void positionDataReceived(PositionData positionData) {
        logPositionDataReceived();

        // Write data to Console
        Map dataMap = positionData.toMap();
        System.out.print("ObjectType: " + dataMap.get("objectType").toString());
        System.out.print(", ObjectId: " + dataMap.get("objectId").toString());
        System.out.print(", longitude: " + dataMap.get("longitude").toString());
        System.out.print(", latitude: " + dataMap.get("latitude").toString());
        System.out.println(", heading: " + dataMap.get("heading").toString());
    }

    public List<JSONObject> getPositionData(Long minTimestamp, Long maxTimestamp, String objectId, PositionData.ObjectType objectType) {
        // this service doesn't fetch data from a DB yet
        return null;
    }


    private void logPositionDataReceived() {
        System.out.print(".");
        numberOfEventsReceived++;
        if (numberOfEventsReceived >= 50) {
            double diffSeconds = (System.currentTimeMillis() - tsLastMeasure) / 1000;
            if (diffSeconds > 0) {
                System.out.printf(" -> %.1f position events per second.\r\n", (numberOfEventsReceived / diffSeconds));
            }
            tsLastMeasure = System.currentTimeMillis();
            numberOfEventsReceived = 0;
        }
    }

}
