import * as jspb from "google-protobuf"

export class Setting extends jspb.Message {
  getHashTag(): string;
  setHashTag(value: string): Setting;

  getChannelName(): string;
  setChannelName(value: string): Setting;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Setting.AsObject;
  static toObject(includeInstance: boolean, msg: Setting): Setting.AsObject;
  static serializeBinaryToWriter(message: Setting, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Setting;
  static deserializeBinaryFromReader(message: Setting, reader: jspb.BinaryReader): Setting;
}

export namespace Setting {
  export type AsObject = {
    hashTag: string,
    channelName: string,
  }
}

export class Comment extends jspb.Message {
  getName(): string;
  setName(value: string): Comment;

  getMessage(): string;
  setMessage(value: string): Comment;

  getPlatformType(): PlatformType;
  setPlatformType(value: PlatformType): Comment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Comment.AsObject;
  static toObject(includeInstance: boolean, msg: Comment): Comment.AsObject;
  static serializeBinaryToWriter(message: Comment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Comment;
  static deserializeBinaryFromReader(message: Comment, reader: jspb.BinaryReader): Comment;
}

export namespace Comment {
  export type AsObject = {
    name: string,
    message: string,
    platformType: PlatformType,
  }
}

export enum PlatformType { 
  TWITTER = 0,
  TWITCH = 1,
}
