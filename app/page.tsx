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

interface UploadedUrls {
  idFront: string | null;
  idBack: string | null;
}

const WEBHOOK_URL = "https://hook.eu2.make.com/dct8sy7t79jezgcql81wapvraruil3wq";

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    idFront: null,
    idBack: null,
    hasBiometric: false,
  });

  const [uploadedUrls, setUploadedUrls] = useState<UploadedUrls>({
    idFront: null,
    idBack: null,
  });


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file: File, type: "front" | "back"): Promise<string | null> => {
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("type", type);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: "idFront" | "idBack"
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setFormData((prev) => ({ ...prev, [field]: file }));

    // Upload to Vercel Blob
    const type = field === "idFront" ? "front" : "back";
    if (field === "idFront") {
      setUploadingFront(true);
    } else {
      setUploadingBack(true);
    }

    const url = await uploadFile(file, type);

    if (url) {
      setUploadedUrls((prev) => ({ ...prev, [field]: url }));
    }

    if (field === "idFront") {
      setUploadingFront(false);
    } else {
      setUploadingBack(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const leadData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || null,
      idFrontUrl: uploadedUrls.idFront,
      idBackUrl: uploadedUrls.idBack,
      hasBiometric: formData.hasBiometric,
      submittedAt: new Date().toISOString(),
    };

    try {
      // Send to Make.com webhook
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });
    } catch (error) {
      console.error("Webhook error:", error);
      // Continue anyway - don't block the user
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.phone.trim() !== "" &&
      uploadedUrls.idFront !== null &&
      !uploadingFront &&
      !uploadingBack
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
              setUploadedUrls({ idFront: null, idBack: null });
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
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="Brain Group"
            className="h-14 mx-auto mb-4"
          />
          <h1 className="text-xl font-semibold">הרשמה לביטוח</h1>
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

          {/* Email (Optional) */}
          <div>
            <label htmlFor="email" className="form-label">
              כתובת מייל <span className="text-gray-400 text-xs">(אופציונלי)</span>
            </label>
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
              onClick={() => !uploadingFront && idFrontRef.current?.click()}
              className={`upload-area ${uploadedUrls.idFront ? "has-file" : ""} ${uploadingFront ? "opacity-70 cursor-wait" : ""}`}
            >
              {uploadingFront ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="spinner-dark" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">מעלה...</span>
                </div>
              ) : uploadedUrls.idFront ? (
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={uploadedUrls.idFront}
                    alt="ID Front Preview"
                    className="image-preview"
                  />
                  <div className="text-right">
                    <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">
                      הועלה בהצלחה ✓
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
                  onClick={() => !uploadingBack && idBackRef.current?.click()}
                  className={`upload-area ${uploadedUrls.idBack ? "has-file" : ""} ${uploadingBack ? "opacity-70 cursor-wait" : ""}`}
                >
                  {uploadingBack ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="spinner-dark" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">מעלה...</span>
                    </div>
                  ) : uploadedUrls.idBack ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={uploadedUrls.idBack}
                        alt="ID Back Preview"
                        className="image-preview"
                      />
                      <div className="text-right">
                        <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">
                          הועלה בהצלחה ✓
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
