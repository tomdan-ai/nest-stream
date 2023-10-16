import { Controller, Post, Body } from '@nestjs/common';
import AWS from 'aws-sdk';

@Controller('video')
export class VideoController {
  private kinesis = new AWS.Kinesis({
    region: 'us-east-1',
    accessKeyId: 'AKIA2VS2KV3E6HKDGLUK',
    secretAccessKey: '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',
  });

  @Post('stream')
  async streamVideo(@Body() videoData: { data: string }) {
    try {
      const params = {
        StreamName: 'your-kinesis-stream-name',
        Data: JSON.stringify(videoData), // You can send video data as a JSON object
        PartitionKey: '1', // You can change this key based on your use case
      };

      const result = await this.sendVideoToKinesis(params);
      return 'Video data sent to Kinesis';
    } catch (error) {
      console.error('Error sending video data to Kinesis:', error);
      throw new Error('Failed to send video data to Kinesis');
    }
  }

  private sendVideoToKinesis(params: AWS.Kinesis.PutRecordInput): Promise<AWS.Kinesis.PutRecordOutput> {
    return new Promise((resolve, reject) => {
      this.kinesis.putRecord(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('Video data sent to Kinesis:', data);
          resolve(data);
        }
      });
    });
  }
}
