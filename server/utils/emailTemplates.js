exports.bookingConfirmationEmail = (ticket, event, user) => ({
  subject: `🎟️ Booking Confirmed — ${event.title}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 16px; }
        .body { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .ticket-card { background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 24px; color: white; margin: 20px 0; }
        .ticket-card h2 { margin: 0 0 16px; font-size: 22px; }
        .ticket-details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .detail-item { background: rgba(255,255,255,0.15); border-radius: 8px; padding: 12px; }
        .detail-label { font-size: 11px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
        .detail-value { font-size: 16px; font-weight: 600; margin-top: 4px; }
        .qr-section { text-align: center; margin: 24px 0; padding: 20px; background: #f8f8f8; border-radius: 12px; }
        .qr-section img { width: 160px; height: 160px; border: 4px solid white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .qr-section p { color: #666; margin: 12px 0 0; font-size: 14px; }
        .info-box { background: #f0f7ff; border-left: 4px solid #667eea; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
        .info-box p { margin: 0; color: #444; font-size: 14px; line-height: 1.6; }
        .footer { background: #f8f8f8; padding: 20px 30px; text-align: center; border-top: 1px solid #eee; }
        .footer p { color: #999; font-size: 13px; margin: 4px 0; }
        .ticket-id { font-family: monospace; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 13px; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div style="font-size: 48px; margin-bottom: 12px;">🎟️</div>
          <h1>Booking Confirmed!</h1>
          <p>Your ticket is ready — see you there!</p>
        </div>

        <div class="body">
          <p class="greeting">Hey <strong>${user.name}</strong>! 👋</p>
          <p style="color: #666; line-height: 1.6;">
            Your booking for <strong>${event.title}</strong> has been confirmed. 
            Here are your ticket details:
          </p>

          <div class="ticket-card">
            <h2>🎪 ${event.title}</h2>
            <div class="ticket-details">
              <div class="detail-item">
                <div class="detail-label">📅 Date</div>
                <div class="detail-value">${new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">📍 Venue</div>
                <div class="detail-value">${event.venue?.city || 'TBA'}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">🎫 Ticket Type</div>
                <div class="detail-value">${ticket.tierName}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">💰 Amount Paid</div>
                <div class="detail-value">₹${ticket.price}</div>
              </div>
            </div>
          </div>

          <div class="qr-section">
            <p style="font-weight: 600; color: #333; margin-bottom: 12px; font-size: 16px;">
              Your Entry QR Code
            </p>
            <img src="${ticket.qrCode}" alt="QR Code" />
            <p>Show this QR code at the event entrance</p>
          </div>

          <div class="info-box">
            <p>
              📌 <strong>Important:</strong> Please carry this QR code (printed or on your phone) 
              to the event for entry. Each QR code is unique and can only be used once.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            Ticket ID: <span class="ticket-id">${ticket._id.toString().slice(-8).toUpperCase()}</span>
          </p>
        </div>

        <div class="footer">
          <p>🎟️ <strong>EventHub</strong> — Your Event Booking Platform</p>
          <p>This is an automated confirmation email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `
});