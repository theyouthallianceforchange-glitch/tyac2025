TYAC WEBSITE — GMAIL LINK UPDATE

Recipient:
theyouthallianceforchange@gmail.com

What changed:
1. Contact email link is available on the public website and in the footer.
2. Contact form tries the existing /api/contact server endpoint first.
3. If the API is unavailable (for example, on static-only hosting), the visitor's default email app opens with the message addressed to TYAC. The visitor must press Send.
4. Fixed the membership form markup so its fields are inside the form and the existing signup mailto handler can work.

Important:
- A mailto link does not send email silently and depends on the visitor having an email app/browser configured.
- To send website form messages automatically without opening the visitor's email app, deploy/configure the server API and SMTP/email provider on the backend. Never put Gmail passwords or SMTP secrets in HTML or JavaScript.
- The secure admin portal and SQL schema require the matching server/API application and environment configuration; these files alone are not a complete backend.
- Use index.html, script.js, and style.css together in your website folder. Keep image assets such as yac.jpg and the other referenced pictures in the same expected paths.
