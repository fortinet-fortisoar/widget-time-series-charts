| [Home](../README.md) |
|--------------------------------------------|

# Installation

1. To install a solution pack, click **Content Hub** > **Discover**.
2. From the list of solution pack that appears, search for and select `Time Series Charts`.
3. Click the `Time Series Charts` solution pack card.
4. Click **Install** on the bottom to begin installation.

## Prerequisites

The `Time Series Charts` Widget relies on the contents of the `Time Series Charts` Solution Pack, which includes a corresponding Connnector, Module, and Playbook Collection in addition to this Widget. If you have installed this Widget directory from the Content Hub, please install the `Time Series Charts` Solution Pack to ensure proper functionality.

# Configuration

**Configuring the Time Series Charts Widget**
Provide the following details to customize the Time Series Charts Widget to suit your requirements:

| Fields     | Description                              |
| ---------- | ---------------------------------------- |
| Title      | Provide the text which will appear above the rendered chart. |
| Time Axis View (X) | The length of the "buckets" into which the events on the rendered chart will be grouped (or example Hourly, Daily, etc.) and the spen which the chart will cover (for example "in the last 7 days", "in the last  3 months", etc.) |

For each Data Set (whether individual or as a part of a Data Set Group), the following additional details may be customized:

| Fields     | Description                              |
| ---------- | ---------------------------------------- |
| Data Set Title      | This is the label which will be associated with this Data Set on the rendered chart |
| Data Source | The module which will be queried for this Data Set |
| Plot Type | How this Data Set will be represented on the resulting chart. For example Bar, Line, Scatter, etc. |
| Field to Build Time Axis With | The field in the corresponding module which will dictate each record's place on the chart's X-Axis |
| Group Results By (optional, individual Data Sets only) | Setting this parameter will automatically break the results of this Data Set's query up into separate representations (bars, scatter point groups, etc) for each value in the picklist field chosen. For example setting this to "Severity" will result in separate representations for "High", "Medium", and "Low" in the resulting chart. |
| Filter Criteria | Set the filters which will determine which records from the chosen module are represented in this Data Set |



Once configured, the Edit Widget interface will look similar to the following screenshots:
<img src="raw.githubusercontent.com/fortinet-fortisoar/widget-time-series-charts/develop/docs/res/widget_config1.png" alt="Editing the Time Series Charts Widget with a single Data Set" style="border: 1px solid #A9A9A9; border-radius: 4px; padding: 10px; display: block;  margin-left: auto; margin-right: auto;">

<img src="raw.githubusercontent.com/fortinet-fortisoar/widget-time-series-charts/develop/docs/res/widget_config2.png" alt="Editing the Time Series Charts Widget with grouped Data Sets" style="border: 1px solid #A9A9A9; border-radius: 4px; padding: 10px; display: block;  margin-left: auto; margin-right: auto;">
