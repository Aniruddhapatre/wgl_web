import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useRef } from "react";
import emailjs from "@emailjs/browser";

const ContactSection = () => {
  const form = useRef();
  const formContainerRef = useRef(null);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          alert("Message sent successfully!");
          form.current.reset();
        },
        () => {
          alert(
            "Failed to send message. Please check your credentials or try again later."
          );
        }
      );
  };

  return (
    <section id="contact" className="no-cursor text-white px-4 sm:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Contact heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-lime-400">Get in Touch</h2>
          <div className="h-1 w-16 bg-lime-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Side: Map & Info */}
          <div className="space-y-6">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.133885919172!2d86.17646727396578!3d23.635375793185133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f423b4970852b5%3A0x651c3222646543d4!2sWorld%20Green%20Line!5e0!3m2!1sen!2sin!4v1755244548671!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-xl shadow-xl border border-lime-500"
            ></iframe>

            <div className="text-sm sm:text-base space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-lime-400 mt-0.5 h-6 w-6 shrink-0" />
                <p>
                  Shiv Shakti Nagar, Near Shiv Mandir <br />
                  Chas, Bokaro, Jharkhand, <br />
                  India - 827013
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-lime-400 mt-0.5 w-6 h-6 shrink-0" />
                <a
                  href="tel:+91 9006613222"
                  className="hover:text-lime-400 transition-colors duration-200"
                >
                  +91 900 661 3222
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-lime-400 mt-0.5 w-6 h-6 shrink-0" />
                <a
                  href="mailto:info@worldgreenline.org"
                  className="hover:text-lime-400 transition-colors duration-200"
                >
                  info@worldgreenline.org
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div
            ref={formContainerRef}
            className="bg-[#0c3f2d] rounded-2xl p-8 shadow-lg border border-lime-400"
          >
            <form ref={form} onSubmit={sendEmail} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="from_name"
                  placeholder="Your Name"
                  required
                  className="p-3 rounded-md bg-green-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="p-3 rounded-md bg-green-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="w-full p-3 rounded-md bg-green-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Your Message / Comment"
                required
                className="w-full p-3 rounded-md bg-green-800 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 bg-lime-400 text-green-900 font-semibold rounded-md hover:bg-lime-300 transition-all"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
