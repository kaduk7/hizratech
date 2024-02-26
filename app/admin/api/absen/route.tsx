import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest,res:NextResponse) => {

    try {
        const response = await fetch(`http://192.168.18.22/iWsService`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
          },
          body: `<GetAttLog><ArgComKey xsi:type="xsd:integer">0</ArgComKey><Arg><PIN xsi:type="xsd:integer">All</PIN></Arg></GetAttLog>`,
        });
    
        const data = await response.text();
        const parsedData = parseData(data);
    
        return NextResponse.json(parsedData, { status: 200 })
      } catch (error) {
        console.error('Error fetching data from the server:', error);
      }
}

function parseData(buffer:any) {
    const result = [];
    const logData = parseDataBetweenTags(buffer, '<GetAttLogResponse>', '</GetAttLogResponse>');
    const logEntries = logData.split('\r\n');
  
    for (let i = 0; i < logEntries.length; i++) {
      const entry = parseDataBetweenTags(logEntries[i], '<Row>', '</Row>');
      const pin = parseDataBetweenTags(entry, '<PIN>', '</PIN>');
      const dateTime = parseDataBetweenTags(entry, '<DateTime>', '</DateTime>');
      const verified = parseDataBetweenTags(entry, '<Verified>', '</Verified>');
      const status = parseDataBetweenTags(entry, '<Status>', '</Status>');
  
      result.push({ PIN: pin, DateTime: dateTime, Verified: verified, Status: status });
    }
  
    return result;
  }
  
  function parseDataBetweenTags(data:any, startTag:any, endTag:any) {
    const startIndex = data.indexOf(startTag) + startTag.length;
    const endIndex = data.indexOf(endTag, startIndex);
    return data.substring(startIndex, endIndex).trim();
  }