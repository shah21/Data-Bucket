import { Readable } from 'stream';



/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
export function bufferToStream(binary:Buffer) {

    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });

    return readableInstanceStream;
}