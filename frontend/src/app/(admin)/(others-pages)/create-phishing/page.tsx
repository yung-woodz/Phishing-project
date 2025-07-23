'use client';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { sendPhishingEmail } from '@/service/email.service';
import { clonePage } from '@/service/clone.service';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { BoxIcon } from '@/icons';
import { useState } from 'react';

export default function CreatePhishingPage() {
  const [form, setForm] = useState({
    fromName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [cloneForm, setCloneForm] = useState({
    name: '',
    url: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (['fromName', 'email', 'subject'].includes(name)) {
      setForm({ ...form, [name]: value });
    } else {
      setCloneForm({ ...cloneForm, [name]: value });
    }
  };

  const handleTextAreaChange = (value: string) => {
    setForm({ ...form, message: value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Clonar la página
      await clonePage(cloneForm);

      // 2. Generar link de rastreo
      const campaignId = cloneForm.name;
      const userId = form.email;
      const trackingLink = `http://146.83.198.35:1606/api/email/track/${campaignId}/${userId}`;

      // 3. Adjuntar link al cuerpo del mensaje
      const updatedForm = {
        ...form,
        message: `${form.message}\n\n🔗 Accede aquí: ${trackingLink}`,
      };

      // 4. Enviar correo
      const result = await sendPhishingEmail(updatedForm);
      setResponse(result.message || 'Correo enviado!!');
    } catch (error) {
      console.error(error);
      setResponse('Error al clonar o enviar el correo :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create Phishing" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-left">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Schedule Your Phishing Campaign Here
          </h3>

          <div className="space-y-6">
            <div>
              <Label>Nombre página</Label>
              <Input type="text" name="name" value={cloneForm.name} onChange={handleChange} />
            </div>
            <div>
              <Label>URL</Label>
              <Input type="text" name="url" value={cloneForm.url} onChange={handleChange} />
            </div>

            <div>
              <Label>Remitente</Label>
              <Input name="fromName" value={form.fromName} onChange={handleChange} />
            </div>

            <div>
              <Label>Correo del destinatario</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>

            <div>
              <Label>Asunto</Label>
              <Input name="subject" value={form.subject} onChange={handleChange} />
            </div>

            <div>
              <Label>Cuerpo del mensaje</Label>
              <TextArea value={form.message} onChange={handleTextAreaChange} rows={6} />
            </div>

            <Button
              size="sm"
              variant="primary"
              endIcon={<BoxIcon />}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </Button>

            {response && <p className="mt-4 text-sm">{response}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
