const nodemailer = require('nodemailer');

// Send order confirmation email using Gmail SMTP (REAL EMAILS)
const sendOrderConfirmation = async (userEmail, userName, orderDetails) => {
  try {
    // Use Gmail SMTP for real emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    // Build email HTML
    const itemsHtml = (orderDetails.items || []).map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');
    
    const mailOptions = {
      from: `"FreshBasket" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - #${orderDetails.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #F3CE2D; padding: 20px; text-align: center; }
            .header h1 { margin: 0; color: #1C1C1C; }
            .content { padding: 20px; }
            .order-details { background-color: #f9f9f9; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #F3CE2D; padding: 10px; text-align: left; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 FreshBasket</h1>
              <p>Order Confirmation</p>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Thank you for your order! Your order has been confirmed and will be delivered soon.</p>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>
                <p><strong>Payment Status:</strong> Paid ✓</p>
              </div>
              
              <h3>Items Ordered</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                  ${itemsHtml || '<tr><td colspan="4">No items</td></tr>'}
                </tbody>
              80
              
              <div class="total">
                <p>Subtotal: ₹${orderDetails.subtotal}</p>
                <p>Platform Fee: ₹${orderDetails.platformFee}</p>
                <p><strong>Grand Total: ₹${orderDetails.totalAmount}</strong></p>
              </div>
              
              <h3>Delivery Address</h3>
              <p>${orderDetails.address?.fullName || ''}<br>
              ${orderDetails.address?.address || ''}<br>
              ${orderDetails.address?.city || ''}, ${orderDetails.address?.state || ''} - ${orderDetails.address?.pincode || ''}<br>
              Phone: ${orderDetails.address?.phone || ''}</p>
            </div>
            <div class="footer">
              <p>Thank you for shopping with FreshBasket!</p>
              <p>For any queries, contact us at support@freshbasket.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', userEmail);
    console.log('📧 Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send order status update email
const sendStatusUpdateEmail = async (userEmail, userName, updateDetails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    const statusIcons = {
      'confirmed': '✅',
      'processing': '🍳',
      'shipped': '🚚',
      'out_for_delivery': '🛵',
      'delivered': '🎉',
      'cancelled': '❌',
    };
    
    const mailOptions = {
      from: `"FreshBasket" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order ${updateDetails.orderId} Status Update: ${updateDetails.status.toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #F3CE2D; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .status-box { background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 10px; }
            .status-icon { font-size: 48px; }
            .status-text { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .btn { background-color: #F3CE2D; padding: 10px 20px; text-decoration: none; color: #1C1C1C; border-radius: 5px; display: inline-block; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 FreshBasket</h1>
              <p>Order Status Update</p>
            </div>
            <div class="content">
              <h2>Hello ${userName},</h2>
              <p>Your order #${updateDetails.orderId} status has been updated!</p>
              
              <div class="status-box">
                <div class="status-icon">${statusIcons[updateDetails.status] || '📦'}</div>
                <div class="status-text">${updateDetails.status.toUpperCase()}</div>
                <p>${updateDetails.message}</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/tracking/${updateDetails.orderId}" class="btn">
                  Track Your Order
                </a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you for shopping with FreshBasket!</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Status update email sent to:', userEmail);
    return { success: true };
  } catch (error) {
    console.error('❌ Status email error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderConfirmation, sendStatusUpdateEmail };