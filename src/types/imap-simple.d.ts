declare module 'imap-simple' {
  export interface ImapSimpleOptions {
    imap: {
      user: string;
      password: string;
      host: string;
      port: number;
      tls: boolean;
      authTimeout?: number;
    };
  }

  export interface MessagePart {
    which: string;
    size: number;
    body: any;
  }

  export interface Message {
    attributes: any;
    parts: MessagePart[];
  }

  export interface Connection {
    openBox(boxName: string): Promise<any>;
    search(criteria: any[], options: any): Promise<Message[]>;
    end(): void;
  }

  export function connect(options: ImapSimpleOptions): Promise<Connection>;
} 