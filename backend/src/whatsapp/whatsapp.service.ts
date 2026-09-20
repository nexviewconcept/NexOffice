import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as QRCode from 'qrcode';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsappService.name);
  private sock: any;
  private qrCodeDataUrl: string | null = null;
  private isConnected: boolean = false;

  async onModuleInit() {
    this.connectToWhatsApp();
  }

  async onModuleDestroy() {
    if (this.sock) {
      this.sock.end(undefined);
    }
  }

  async connectToWhatsApp() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState('./whatsapp-auth');

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: (require('pino')({ level: 'silent' })) as any,
      });

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
          // Generate a QR Code image URL for the frontend
          this.logger.log('New WhatsApp QR Code generated.');
          this.qrCodeDataUrl = await QRCode.toDataURL(qr);
          this.isConnected = false;
        }

        if (connection === 'close') {
          this.isConnected = false;
          this.qrCodeDataUrl = null;
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          this.logger.warn(`WhatsApp connection closed. Reconnecting: ${shouldReconnect}`);
          
          if (shouldReconnect) {
            this.connectToWhatsApp();
          } else {
            // Logged out, clear auth
            this.logger.log('WhatsApp logged out. Restarting connection to generate new QR...');
            const fs = require('fs');
            if (fs.existsSync('./whatsapp-auth')) {
              fs.rmSync('./whatsapp-auth', { recursive: true, force: true });
            }
            setTimeout(() => this.connectToWhatsApp(), 2000);
          }
        } else if (connection === 'open') {
          this.isConnected = true;
          this.qrCodeDataUrl = null;
          this.logger.log('WhatsApp connection opened successfully!');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);

    } catch (error) {
      this.logger.error('Failed to initialize WhatsApp connection', error);
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      qrCode: this.isConnected ? null : this.qrCodeDataUrl,
    };
  }
  
  async logout() {
      if (this.sock) {
          await this.sock.logout();
      }
      return { success: true };
  }

  async sendMessage(to: string, message: string) {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp is not connected.');
    }
    
    // Format number to WhatsApp JID format (country code + number + @s.whatsapp.net)
    // E.g. 08012345678 -> 2348012345678@s.whatsapp.net
    let formattedNumber = to.replace(/[^0-9]/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '234' + formattedNumber.substring(1);
    }
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await this.sock.sendMessage(jid, { text: message });
    return { success: true };
  }

  async sendDocument(to: string, documentBuffer: Buffer, fileName: string, caption?: string) {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp is not connected.');
    }
    
    let formattedNumber = to.replace(/[^0-9]/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '234' + formattedNumber.substring(1);
    }
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await this.sock.sendMessage(jid, { 
      document: documentBuffer, 
      mimetype: 'application/pdf', 
      fileName: fileName,
      caption: caption 
    });
    return { success: true };
  }
}
