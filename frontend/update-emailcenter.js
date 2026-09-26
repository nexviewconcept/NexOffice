const fs = require('fs');
const path = 'D:/NexPortal/NexOffice/frontend/src/pages/EmailCenter.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add attachment state
content = content.replace(
  'const [sending, setSending] = useState(false);',
  'const [sending, setSending] = useState(false);\n  const [attachment, setAttachment] = useState<File | null>(null);'
);

// Replace handleSendEmail logic
content = content.replace(
  /const handleSendEmail = async[^]*?setSending\(false\);\n    \};\n/m,
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('senderEmail', emailData.senderEmail);
      formData.append('recipient', emailData.recipient);
      formData.append('subject', emailData.subject);
      formData.append('body', emailData.body);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await api.post('/emails/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSendModal(false);
      setEmailData({ senderEmail: 'info@nexviewconcept.com.ng', recipient: '', subject: '', body: '' });
      setAttachment(null);
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };\n
);

// Add file input to the form
content = content.replace(
  '</form>',
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach File (PDF, etc)</label>
      <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full text-sm" />
    </div>
    <div className="pt-4 flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={() => setSendModal(false)}>Cancel</Button>
      <Button type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Email'}</Button>
    </div>
  </form>
);

// Remove the existing Buttons if they are now duplicated
content = content.replace(
  /<div className="pt-4 flex justify-end gap-2">\s*<Button type="button" variant="outline" onClick=\{\(\) => setSendModal\(false\)\}>Cancel<\/Button>\s*<Button type="submit" disabled=\{sending\}>\{sending \? 'Sending\.\.\.' : 'Send Email'\}<\/Button>\s*<\/div>\s*<\/form>/,
  '</form>'
);

fs.writeFileSync(path, content, 'utf8');
