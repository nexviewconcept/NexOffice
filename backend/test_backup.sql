--
-- PostgreSQL database dump
--

\restrict YLpJDccdCoOiy5XX4axnKMb2fGQs6XNtIIBLzBG8ZbMevhn7l7DcckeCq2uqn3X

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Announcement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Announcement" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    recurrence text DEFAULT 'ONCE'::text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    channel text DEFAULT 'DASHBOARD'::text NOT NULL,
    audience text DEFAULT 'ALL'::text NOT NULL,
    "repeatEmail" boolean DEFAULT false NOT NULL,
    "startDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiryDate" timestamp(3) without time zone,
    "createdBy" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Announcement" OWNER TO postgres;

--
-- Name: AnnouncementOccurrence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AnnouncementOccurrence" (
    id text NOT NULL,
    "announcementId" text NOT NULL,
    "firedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AnnouncementOccurrence" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    "userId" text,
    action text NOT NULL,
    entity text NOT NULL,
    "entityId" text,
    "ipAddress" text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    "staffId" text,
    "certificateNumber" text NOT NULL,
    "recipientName" text NOT NULL,
    "courseName" text NOT NULL,
    "issueDate" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'VALID'::text NOT NULL
);


ALTER TABLE public."Certificate" OWNER TO postgres;

--
-- Name: Client; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Client" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    type text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Client" OWNER TO postgres;

--
-- Name: EmailLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmailLog" (
    id text NOT NULL,
    recipient text NOT NULL,
    subject text NOT NULL,
    template text,
    status text NOT NULL,
    "sentAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EmailLog" OWNER TO postgres;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    "paymentMethod" text NOT NULL,
    reference text,
    "expenseDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Expense" OWNER TO postgres;

--
-- Name: ExpenseCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExpenseCategory" (
    id text NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."ExpenseCategory" OWNER TO postgres;

--
-- Name: File; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."File" (
    id text NOT NULL,
    filename text NOT NULL,
    "originalName" text NOT NULL,
    "mimeType" text NOT NULL,
    size integer NOT NULL,
    folder text DEFAULT 'General'::text NOT NULL,
    description text,
    "uploadedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."File" OWNER TO postgres;

--
-- Name: InventoryItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryItem" (
    id text NOT NULL,
    name text NOT NULL,
    sku text NOT NULL,
    category text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "minQuantity" integer DEFAULT 0 NOT NULL,
    location text,
    condition text,
    "purchaseCost" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InventoryItem" OWNER TO postgres;

--
-- Name: InventoryTransaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryTransaction" (
    id text NOT NULL,
    "itemId" text NOT NULL,
    type text NOT NULL,
    quantity integer NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InventoryTransaction" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "clientId" text NOT NULL,
    "invoiceNumber" text NOT NULL,
    status text DEFAULT 'DRAFT'::text NOT NULL,
    "issueDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone,
    subtotal double precision NOT NULL,
    total double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: InvoiceItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InvoiceItem" (
    id text NOT NULL,
    "invoiceId" text NOT NULL,
    description text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit text,
    "unitPrice" double precision NOT NULL,
    total double precision NOT NULL
);


ALTER TABLE public."InvoiceItem" OWNER TO postgres;

--
-- Name: NotificationReadStatus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."NotificationReadStatus" (
    id text NOT NULL,
    "occurrenceId" text NOT NULL,
    "userId" text NOT NULL,
    "readAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."NotificationReadStatus" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    action text NOT NULL,
    description text
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Receipt" (
    id text NOT NULL,
    "invoiceId" text,
    "receiptNumber" text NOT NULL,
    amount double precision NOT NULL,
    "paymentMethod" text NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Receipt" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: StaffProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StaffProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "staffIdNumber" text,
    department text,
    designation text,
    "photoUrl" text,
    "dateJoined" timestamp(3) without time zone
);


ALTER TABLE public."StaffProfile" OWNER TO postgres;

--
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SystemSetting" (
    key text NOT NULL,
    value text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemSetting" OWNER TO postgres;

--
-- Name: Ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ticket" (
    id text NOT NULL,
    "ticketNumber" text NOT NULL,
    subject text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    priority text DEFAULT 'NORMAL'::text NOT NULL,
    category text DEFAULT 'GENERAL'::text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Ticket" OWNER TO postgres;

--
-- Name: TicketMessage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TicketMessage" (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    "isStaff" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."TicketMessage" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "notificationEmail" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserRole; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserRole" (
    "userId" text NOT NULL,
    "roleId" text NOT NULL
);


ALTER TABLE public."UserRole" OWNER TO postgres;

--
-- Data for Name: Announcement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Announcement" (id, title, message, recurrence, status, channel, audience, "repeatEmail", "startDate", "expiryDate", "createdBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AnnouncementOccurrence; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AnnouncementOccurrence" (id, "announcementId", "firedAt") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, "userId", action, entity, "entityId", "ipAddress", "timestamp") FROM stdin;
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Certificate" (id, "staffId", "certificateNumber", "recipientName", "courseName", "issueDate", status) FROM stdin;
\.


--
-- Data for Name: Client; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Client" (id, name, email, phone, address, type, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: EmailLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmailLog" (id, recipient, subject, template, status, "sentAt") FROM stdin;
\.


--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expense" (id, "categoryId", amount, description, "paymentMethod", reference, "expenseDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExpenseCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExpenseCategory" (id, name, description) FROM stdin;
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."File" (id, filename, "originalName", "mimeType", size, folder, description, "uploadedById", "createdAt") FROM stdin;
\.


--
-- Data for Name: InventoryItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryItem" (id, name, sku, category, quantity, "minQuantity", location, condition, "purchaseCost", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InventoryTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryTransaction" (id, "itemId", type, quantity, notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, "clientId", "invoiceNumber", status, "issueDate", "dueDate", subtotal, total, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InvoiceItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InvoiceItem" (id, "invoiceId", description, quantity, unit, "unitPrice", total) FROM stdin;
\.


--
-- Data for Name: NotificationReadStatus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."NotificationReadStatus" (id, "occurrenceId", "userId", "readAt") FROM stdin;
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, action, description) FROM stdin;
\.


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Receipt" (id, "invoiceId", "receiptNumber", amount, "paymentMethod", "paymentDate", notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description) FROM stdin;
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" ("roleId", "permissionId") FROM stdin;
\.


--
-- Data for Name: StaffProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StaffProfile" (id, "userId", "firstName", "lastName", "staffIdNumber", department, designation, "photoUrl", "dateJoined") FROM stdin;
\.


--
-- Data for Name: SystemSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SystemSetting" (key, value, "updatedAt") FROM stdin;
currency	NGN	2026-08-13 08:32:26.727
supportEmail	support@nexview.com	2026-08-13 08:32:26.728
companyName	Nexview Concept Limited	2026-08-13 08:32:26.729
supportPhone	+234 800 000 0000	2026-08-13 08:32:26.74
companyAddress	Abuja, Nigeria	2026-08-13 08:32:26.73
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ticket" (id, "ticketNumber", subject, status, priority, category, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TicketMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TicketMessage" (id, "ticketId", "userId", message, "isStaff", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, "passwordHash", status, "createdAt", "updatedAt", "notificationEmail") FROM stdin;
\.


--
-- Data for Name: UserRole; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserRole" ("userId", "roleId") FROM stdin;
\.


--
-- Name: AnnouncementOccurrence AnnouncementOccurrence_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementOccurrence"
    ADD CONSTRAINT "AnnouncementOccurrence_pkey" PRIMARY KEY (id);


--
-- Name: Announcement Announcement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Announcement"
    ADD CONSTRAINT "Announcement_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: Client Client_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Client"
    ADD CONSTRAINT "Client_pkey" PRIMARY KEY (id);


--
-- Name: EmailLog EmailLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmailLog"
    ADD CONSTRAINT "EmailLog_pkey" PRIMARY KEY (id);


--
-- Name: ExpenseCategory ExpenseCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseCategory"
    ADD CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY (id);


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: InventoryItem InventoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_pkey" PRIMARY KEY (id);


--
-- Name: InventoryTransaction InventoryTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY (id);


--
-- Name: InvoiceItem InvoiceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: NotificationReadStatus NotificationReadStatus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationReadStatus"
    ADD CONSTRAINT "NotificationReadStatus_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId", "permissionId");


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: StaffProfile StaffProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffProfile"
    ADD CONSTRAINT "StaffProfile_pkey" PRIMARY KEY (id);


--
-- Name: SystemSetting SystemSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "SystemSetting_pkey" PRIMARY KEY (key);


--
-- Name: TicketMessage TicketMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


--
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId", "roleId");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Certificate_certificateNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON public."Certificate" USING btree ("certificateNumber");


--
-- Name: ExpenseCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON public."ExpenseCategory" USING btree (name);


--
-- Name: InventoryItem_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InventoryItem_sku_key" ON public."InventoryItem" USING btree (sku);


--
-- Name: Invoice_invoiceNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON public."Invoice" USING btree ("invoiceNumber");


--
-- Name: NotificationReadStatus_occurrenceId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "NotificationReadStatus_occurrenceId_userId_key" ON public."NotificationReadStatus" USING btree ("occurrenceId", "userId");


--
-- Name: Permission_action_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_action_key" ON public."Permission" USING btree (action);


--
-- Name: Receipt_receiptNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON public."Receipt" USING btree ("receiptNumber");


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: StaffProfile_staffIdNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StaffProfile_staffIdNumber_key" ON public."StaffProfile" USING btree ("staffIdNumber");


--
-- Name: StaffProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "StaffProfile_userId_key" ON public."StaffProfile" USING btree ("userId");


--
-- Name: Ticket_ticketNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON public."Ticket" USING btree ("ticketNumber");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: AnnouncementOccurrence AnnouncementOccurrence_announcementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AnnouncementOccurrence"
    ADD CONSTRAINT "AnnouncementOccurrence_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES public."Announcement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Certificate Certificate_staffId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES public."StaffProfile"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."ExpenseCategory"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryTransaction InventoryTransaction_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public."InventoryItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InvoiceItem InvoiceItem_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InvoiceItem"
    ADD CONSTRAINT "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_clientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES public."Client"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: NotificationReadStatus NotificationReadStatus_occurrenceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationReadStatus"
    ADD CONSTRAINT "NotificationReadStatus_occurrenceId_fkey" FOREIGN KEY ("occurrenceId") REFERENCES public."AnnouncementOccurrence"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NotificationReadStatus NotificationReadStatus_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."NotificationReadStatus"
    ADD CONSTRAINT "NotificationReadStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Receipt Receipt_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StaffProfile StaffProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StaffProfile"
    ADD CONSTRAINT "StaffProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketMessage TicketMessage_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public."Ticket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TicketMessage TicketMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TicketMessage"
    ADD CONSTRAINT "TicketMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Ticket Ticket_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ticket"
    ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRole UserRole_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserRole UserRole_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserRole"
    ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict YLpJDccdCoOiy5XX4axnKMb2fGQs6XNtIIBLzBG8ZbMevhn7l7DcckeCq2uqn3X

