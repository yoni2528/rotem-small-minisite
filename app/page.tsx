"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  idFront: File | null;
  idBack: File | null;
  hasBiometric: boolean;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    idFront: null,
    idBack: null,
    hasBiometric: false,
  });

  const [showEmailField, setShowEmailField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "idFront" | "idBack"
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.idFront !== null
    );
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card rounded-xl p-8 max-w-md w-full text-center fade-in">
          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-600 dark:text-emerald-400"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">הטופס נשלח בהצלחה</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            תודה על פנייתך. נציג יצור איתך קשר בהקדם.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: "",
                phone: "",
                email: "",
                idFront: null,
                idBack: null,
                hasBiometric: false,
              });
              setShowEmailField(false);
            }}
            className="submit-btn"
          >
            שליחת טופס נוסף
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="card rounded-xl p-6 md:p-8 max-w-md w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold">הרשמה לביטוח</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            מלאו את הפרטים הבאים להמשך התהליך
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="form-label">
              שם מלא <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="הזינו את שמכם המלא"
              className="form-input"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="form-label">
              מספר טלפון <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="050-000-0000"
              className="form-input"
              dir="ltr"
              style={{ textAlign: "left" }}
              required
            />
          </div>

          {/* Optional Email Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowEmailField(!showEmailField)}
              className="flex items-center gap-2 text-link text-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${showEmailField ? "rotate-45" : ""}`}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              {showEmailField ? "הסתר שדה מייל" : "הוסף כתובת מייל (אופציונלי)"}
            </button>

            {showEmailField && (
              <div className="mt-3 fade-in">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="form-input"
                  dir="ltr"
                  style={{ textAlign: "left" }}
                />
              </div>
            )}
          </div>

          {/* ID Front Upload */}
          <div>
            <label className="form-label">
              צילום תעודת זהות (צד קדמי) <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              ref={idFrontRef}
              onChange={(e) => handleFileChange(e, "idFront")}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => idFrontRef.current?.click()}
              className={`upload-area ${formData.idFront ? "has-file" : ""}`}
            >
              {formData.idFront ? (
                <div className="flex items-center justify-center gap-3">
                  {formData.idFront.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.idFront)}
                      alt="ID Front Preview"
                      className="image-preview"
                    />
                  )}
                  <div className="text-right">
                    <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">
                      {formData.idFront.name}
                    </p>
                    <p className="text-xs text-gray-500">לחצו להחלפה</p>
                  </div>
                </div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    לחצו להעלאת צילום ת.ז
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Biometric ID Option */}
          <div>
            <div
              onClick={() =>
                setFormData((prev) => ({ ...prev, hasBiometric: !prev.hasBiometric }))
              }
              className="checkbox-wrapper"
            >
              <div className={`custom-checkbox ${formData.hasBiometric ? "checked" : ""}`}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                תעודת זהות ביומטרית (עם צד אחורי)
              </span>
            </div>

            {/* ID Back Upload (for biometric) */}
            {formData.hasBiometric && (
              <div className="mt-3 fade-in">
                <label className="form-label">צילום צד אחורי של ת.ז</label>
                <input
                  type="file"
                  ref={idBackRef}
                  onChange={(e) => handleFileChange(e, "idBack")}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => idBackRef.current?.click()}
                  className={`upload-area ${formData.idBack ? "has-file" : ""}`}
                >
                  {formData.idBack ? (
                    <div className="flex items-center justify-center gap-3">
                      {formData.idBack.type.startsWith("image/") && (
                        <img
                          src={URL.createObjectURL(formData.idBack)}
                          alt="ID Back Preview"
                          className="image-preview"
                        />
                      )}
                      <div className="text-right">
                        <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">
                          {formData.idBack.name}
                        </p>
                        <p className="text-xs text-gray-500">לחצו להחלפה</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-8 h-8 mx-auto mb-2 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        לחצו להעלאת צד אחורי
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="submit-btn flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                <span>שולח...</span>
              </>
            ) : (
              <span>שליחת הפרטים</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5">
          המידע שלך מאובטח ומוגן בהתאם לתקנות הגנת הפרטיות
        </p>
      </main>
    </div>
  );
}
