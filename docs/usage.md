| [Home](../README.md) |
|--------------------------------------------|

# Usage

When a new instance of the Time Series Charts Widget is configured, a record is created in the Time Series Charts module. This record contains the queries defined in the Widget's Data Sets, and has an additional field into which the query results will be stored. The creation of this record triggers a playbook from the Time Series Charts Solution Pack, which processes the configuration data into a set of query payloads. Typically there will be one query payload for each Data Set, for each window of time in the span configured in the Widget. The Playbook will run all necessary queries, and then save the results in the corresponding Module record. Once this has happened, the Widget will show the results rendered into a chart as per the Widget's configuration.

Once the chart has been initialized in this way, subsequent queries will need to be run periodically to keep the chart up-to-date. This can be done by creating a Schedule to execute the "Update All Time Series Charts" Playbook included in the Time Series Charts Solution Pack.