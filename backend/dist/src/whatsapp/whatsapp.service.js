"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const QRCode = __importStar(require("qrcode"));
let WhatsappService = WhatsappService_1 = class WhatsappService {
    logger = new common_1.Logger(WhatsappService_1.name);
    sock;
    qrCodeDataUrl = null;
    isConnected = false;
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
            const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)('./whatsapp-auth');
            this.sock = (0, baileys_1.default)({
                auth: state,
                printQRInTerminal: false,
                logger: (require('pino')({ level: 'silent' })),
            });
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    this.logger.log('New WhatsApp QR Code generated.');
                    this.qrCodeDataUrl = await QRCode.toDataURL(qr);
                    this.isConnected = false;
                }
                if (connection === 'close') {
                    this.isConnected = false;
                    this.qrCodeDataUrl = null;
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut;
                    this.logger.warn(`WhatsApp connection closed. Reconnecting: ${shouldReconnect}`);
                    if (shouldReconnect) {
                        this.connectToWhatsApp();
                    }
                    else {
                        this.logger.log('WhatsApp logged out. Restarting connection to generate new QR...');
                        const fs = require('fs');
                        if (fs.existsSync('./whatsapp-auth')) {
                            fs.rmSync('./whatsapp-auth', { recursive: true, force: true });
                        }
                        setTimeout(() => this.connectToWhatsApp(), 2000);
                    }
                }
                else if (connection === 'open') {
                    this.isConnected = true;
                    this.qrCodeDataUrl = null;
                    this.logger.log('WhatsApp connection opened successfully!');
                }
            });
            this.sock.ev.on('creds.update', saveCreds);
        }
        catch (error) {
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
    async sendMessage(to, message) {
        if (!this.isConnected || !this.sock) {
            throw new Error('WhatsApp is not connected.');
        }
        let formattedNumber = to.replace(/[^0-9]/g, '');
        if (formattedNumber.startsWith('0')) {
            formattedNumber = '234' + formattedNumber.substring(1);
        }
        const jid = `${formattedNumber}@s.whatsapp.net`;
        await this.sock.sendMessage(jid, { text: message });
        return { success: true };
    }
    async sendDocument(to, documentBuffer, fileName, caption) {
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
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map