"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
} from "lucide-react";

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 2 ? "Name must be at least 2 characters" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email"
          : "";
      case "phone":
        return !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))
          ? "Please enter a valid phone number"
          : "";
      case "company":
        return value.length < 2
          ? "Company name must be at least 2 characters"
          : "";
      case "message":
        return value.length < 10
          ? "Message must be at least 10 characters"
          : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // Update progress
    const filledFields = Object.values({ ...formData, [name]: value }).filter(
      (val) => val.trim() !== ""
    ).length;
    setProgress((filledFields / 5) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first invalid field
      const firstErrorField = Object.keys(newErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://crm1.i4interface.com/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-key": "client_68cbd64a75cce81b7a168671",
        },
        body: JSON.stringify(formData),
      });

      



      if (!response.status === 201) {
        throw new Error("Failed to submit lead");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setProgress(0);
    } catch (error) {
      console.error("Error submitting lead:", error);
      // setErrors({ submit: "Failed to submit. Please try again." });
    } finally {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setProgress(0);
    }
  };

  // Keyboard shortcuts for testing
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSubmit(e);
    }
    if (e.ctrlKey && e.key === "r") {
      e.preventDefault();
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setErrors({});
      setProgress(0);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="glass-morphism animate-float">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-primary mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-primary">Thank You!</h3>
            <p className="text-muted-foreground">
              Your information has been submitted successfully. We'll get back
              to you soon!
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Submit Another Lead
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism" onKeyDown={handleKeyDown}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">
          Get In Touch
        </CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you within 24 hours
        </CardDescription>
        {progress > 0 && (
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`transition-all duration-200 ${
                errors.name
                  ? "border-destructive animate-shake"
                  : "focus:border-primary"
              }`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`transition-all duration-200 ${
                errors.email
                  ? "border-destructive animate-shake"
                  : "focus:border-primary"
              }`}
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={`transition-all duration-200 ${
                errors.phone
                  ? "border-destructive animate-shake"
                  : "focus:border-primary"
              }`}
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company Name *
            </Label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              className={`transition-all duration-200 ${
                errors.company
                  ? "border-destructive animate-shake"
                  : "focus:border-primary"
              }`}
              placeholder="Enter your company name"
              required
            />
            {errors.company && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.company}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={`transition-all duration-200 min-h-[100px] ${
                errors.message
                  ? "border-destructive animate-shake"
                  : "focus:border-primary"
              }`}
              placeholder="Tell us about your project or requirements..."
              required
            />
            {errors.message && (
              <p className="text-destructive text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.message}
              </p>
            )}
          </div>

          {errors.submit && (
            <p className="text-destructive text-sm flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.submit}
            </p>
          )}

          <Button
            type="submit"
            className="w-full relative overflow-hidden group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Lead"
            )}
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
