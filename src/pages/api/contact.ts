export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let nama = '';
    let telepon = '';
    let email = '';
    let pesan = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      nama = body.nama || '';
      telepon = body.telepon || '';
      email = body.email || '';
      pesan = body.pesan || '';
    } else {
      const formData = await request.formData();
      nama = formData.get('nama')?.toString() || '';
      telepon = formData.get('telepon')?.toString() || '';
      email = formData.get('email')?.toString() || '';
      pesan = formData.get('pesan')?.toString() || '';
    }

    // Server-side validation
    if (!nama.trim() || !telepon.trim() || !pesan.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Mohon lengkapi Nama, Telepon, dan Pesan Anda.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // In production, you can forward this to email, WhatsApp API, or database
    console.log(`[Contact Form Received] Dari: ${nama} (${telepon}, ${email}) - Pesan: ${pesan}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Terima kasih! Pesan Anda telah kami terima. Tim Vannabox akan segera menghubungi Anda.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error handling contact form:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Terjadi kesalahan sistem saat memproses pesan Anda. Silakan coba kembali.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
