import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

// Initialize EmailJS (do this once at app startup)
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// --- ICONS --- //
const XIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SeedlingIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,2A10,10,0,0,0,2,12a9.91,9.91,0,0,0,2.7,6.8A1,1,0,0,0,6,18.17V16a1,1,0,0,1,1-1,5,5,0,0,0,4-4V8.5A1.5,1.5,0,0,1,12.5,7,1,1,0,0,0,12,6a1,1,0,0,0-1,1,3.5,3.5,0,0,0,3.5,3.5,3.41,3.41,0,0,0,1.1-.18,1,1,0,0,0,.4-1.28,7,7,0,0,1-4.4-6.35A10,10,0,0,0,12,2Z"/>
    </svg>
);

const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// --- CONFIGURATION DATA --- //
const aboutNgo = {
    title: "Join the Movement to Heal Our Planet",
    description: "World Green Line is dedicated to restoring our planet's health by championing reforestation, clean water initiatives, and sustainable community development. We believe that collective action can create a thriving, green future for generations to come.",
    whyJoin: {
        title: "Why You Should Join World Green Line",
        intro: "Becoming a part of our team means you're not just taking a job or a volunteer role; you're becoming a crucial part of a global movement. Here's what you can expect:",
        points: [
            { title: "Make a Tangible Impact", description: "Your work directly contributes to planting trees, providing clean water, and building a sustainable future. See the real-world results of your efforts." },
            { title: "Grow and Learn", description: "Gain hands-on experience in environmental conservation, project management, and community outreach. We invest in our team's growth." },
            { title: "Join a Passionate Community", description: "Work alongside a diverse team of dedicated, like-minded individuals who share your passion for protecting the planet." },
            { title: "Lead the Change", description: "We empower our team members to take initiative and lead projects, fostering a culture of innovation and responsibility." }
        ]
    }
};

// --- REUSABLE COMPONENTS --- //
const FormField = ({ label, type = 'text', name, value, onChange, placeholder, required = false, disabled = false, children, accept }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea 
                id={name} 
                name={name} 
                rows="4" 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                required={required} 
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-75" 
            />
        ) : type === 'file' ? (
            <input 
                type={type} 
                id={name} 
                name={name} 
                onChange={onChange} 
                required={required} 
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-75"
                accept={accept}
            />
        ) : (
            <input 
                type={type} 
                id={name} 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                required={required} 
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-75" 
            />
        )}
        {children}
    </div>
);

// --- DYNAMIC BACKGROUND COMPONENT --- //
const DynamicBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particlesArray = [];
        const numberOfParticles = 100;
        const mouse = { x: null, y: null, radius: 150 };
        const handleMouseMove = (event) => { mouse.x = event.x; mouse.y = event.y; };
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; }
                if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; }
                let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) { this.x += 5; }
                    if (mouse.x > this.x && this.x > this.size * 10) { this.x -= 5; }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) { this.y += 5; }
                    if (mouse.y > this.y && this.y > this.size * 10) { this.y -= 5; }
                }
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }
        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2; let directionY = (Math.random() * .4) - .2;
                let color = 'rgba(16, 185, 129, 0.5)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); }
        }
        function handleResize() { 
            canvas.width = window.innerWidth; 
            canvas.height = window.innerHeight; 
            init(); 
        }
        
        init(); 
        animate();
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>;
}

// --- MAIN APP COMPONENT --- //
const InternshipPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [formData, setFormData] = useState({
        opportunityType: 'internship', 
        name: '', 
        location: '', 
        dob: '', 
        email: '', 
        contact: '',
        duration: '', 
        joinDate: '', 
        reason: '', 
        college: '', 
        experience: '', 
        resume: null,
        resumeName: ''
    });

    const validateForm = () => {
        if (!formData.name.trim()) {
            alert('Please enter your full name');
            return false;
        }
        if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
            alert('Please enter a valid email address');
            return false;
        }
        if (!formData.contact || !/^\d{10}$/.test(formData.contact)) {
            alert('Please enter a valid 10-digit contact number');
            return false;
        }
        if (!formData.resume) {
            alert('Please upload your resume');
            return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file' && files && files[0]) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                resume: file,
                resumeName: file.name
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);

        try {
            // Prepare template parameters for EmailJS
            const templateParams = {
                opportunity_type: formData.opportunityType,
                name: formData.name,
                email: formData.email,
                contact: formData.contact,
                location: formData.location,
                duration: formData.duration,
                reason: formData.reason,
                college: formData.college,
                experience: formData.experience,
                resume_name: formData.resumeName,
                join_date: formData.joinDate,
                dob: formData.dob,
                submission_date: new Date().toLocaleString()
            };

            // Send email via EmailJS
            const response = await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                templateParams
            );

            setSubmitSuccess(true);
            
            // Reset form
            setFormData({
                opportunityType: 'internship',
                name: '',
                location: '',
                dob: '',
                email: '',
                contact: '',
                duration: '',
                joinDate: '',
                reason: '',
                college: '',
                experience: '',
                resume: null,
                resumeName: ''
            });
            
            setTimeout(() => {
                setIsModalOpen(false);
                setSubmitSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="text-white">
            <DynamicBackground />
            <div className="relative z-10">
                {/* Informational Section */}
                <div className="py-20 sm:py-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-base font-semibold text-emerald-400 tracking-wider uppercase">Our Mission</h2>
                            <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{aboutNgo.whyJoin.title}</p>
                            <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-300">{aboutNgo.whyJoin.intro}</p>
                        </div>
                        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                            {aboutNgo.whyJoin.points.map((point) => (
                                <div key={point.title} className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-2">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-500 text-white mb-6">
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{point.title}</h3>
                                    <p className="mt-2 text-base text-gray-400">{point.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
                     <div className="bg-black bg-opacity-30 backdrop-blur-sm p-8 md:p-12 rounded-2xl max-w-4xl">
                        <SeedlingIcon className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
                        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">{aboutNgo.title}</h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">{aboutNgo.description}</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-block bg-emerald-500 text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transform hover:scale-105 transition-all duration-300"
                        >
                            Become a Changemaker
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
                    <div className="relative bg-white text-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold">Application Form</h2>
                            <button 
                                onClick={() => !isSubmitting && setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                                disabled={isSubmitting}
                            >
                                <XIcon className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                        {submitSuccess ? (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                                <CheckCircleIcon className="w-20 h-20 text-emerald-500 mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                                <p className="text-lg text-gray-600 mb-6">Thank you for your application. We'll get back to you soon.</p>
                                <p className="text-gray-500">This window will close automatically...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Applying for <span className="text-red-500">*</span></label>
                                        <div className="flex flex-wrap gap-4">
                                            {['internship', 'volunteer', 'full-time'].map(type => (
                                                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                                    <input 
                                                        type="radio" 
                                                        name="opportunityType" 
                                                        value={type} 
                                                        checked={formData.opportunityType === type} 
                                                        onChange={handleInputChange} 
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                        disabled={isSubmitting}
                                                        required
                                                    />
                                                    <span className="capitalize">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField 
                                            label="Full Name" 
                                            name="name" 
                                            value={formData.name} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g., Jane Doe" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <FormField 
                                            label="Where are you based?" 
                                            name="location" 
                                            value={formData.location} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g., Mumbai, India" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <FormField 
                                            label="Date of Birth" 
                                            name="dob" 
                                            type="date" 
                                            value={formData.dob} 
                                            onChange={handleInputChange} 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <FormField 
                                            label="Email ID" 
                                            name="email" 
                                            type="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange} 
                                            placeholder="you@example.com" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <FormField 
                                            label="Contact Number" 
                                            name="contact" 
                                            type="tel" 
                                            value={formData.contact} 
                                            onChange={handleInputChange} 
                                            placeholder="10-digit number" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                        <FormField 
                                            label="Available duration for work" 
                                            name="duration" 
                                            value={formData.duration} 
                                            onChange={handleInputChange} 
                                            placeholder="e.g., 3 months, long-term" 
                                            required 
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <FormField 
                                        label="Earliest date of joining" 
                                        name="joinDate" 
                                        type="date" 
                                        value={formData.joinDate} 
                                        onChange={handleInputChange} 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                    <FormField 
                                        label="College / Institute Name" 
                                        name="college" 
                                        value={formData.college} 
                                        onChange={handleInputChange} 
                                        placeholder="Your college/institute name" 
                                        disabled={isSubmitting}
                                    />
                                    <FormField 
                                        label="Why do you wish to join World Green Line?" 
                                        name="reason" 
                                        type="textarea" 
                                        value={formData.reason} 
                                        onChange={handleInputChange} 
                                        placeholder="Tell us what motivates you to join our cause." 
                                        required 
                                        disabled={isSubmitting}
                                    />
                                    <FormField 
                                        label="Do you have any work experience? If yes, please specify." 
                                        name="experience" 
                                        type="textarea" 
                                        value={formData.experience} 
                                        onChange={handleInputChange} 
                                        placeholder="Describe your previous roles and responsibilities." 
                                        disabled={isSubmitting}
                                    />
                                    <FormField 
                                        label="Upload Resume" 
                                        name="resume" 
                                        type="file" 
                                        onChange={handleInputChange} 
                                        required
                                        disabled={isSubmitting}
                                        accept=".pdf,.doc,.docx"
                                    >
                                        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 5MB. {formData.resumeName && <span className="text-emerald-600 font-semibold">File selected: {formData.resumeName}</span>}</p>
                                    </FormField>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)} 
                                        className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-lg mr-4 hover:bg-gray-300 transition"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className={`bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700 transition flex items-center ${isSubmitting ? 'opacity-75' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InternshipPage;