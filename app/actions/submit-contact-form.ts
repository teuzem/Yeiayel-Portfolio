"use server";

import { serverClient } from "@/sanity/lib/serverClient";
import { isSanityWriteConfigured } from "@/sanity/lib/serverEnv";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Validate the required fields
    if (!name || !email || !message) {
      return {
        success: false,
        error: "Please fill in all required fields",
      };
    }

    if (!isSanityWriteConfigured) {
      return {
        success: false,
        error:
          "Contact storage is not configured. Please use the direct contact details instead.",
      };
    }

    // Create the document in Sanity
    const result = await serverClient.create({
      _type: "contact",
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unknown persistence error";
    console.error(`Error submitting contact form: ${details}`);
    return {
      success: false,
      error: "Failed to submit the form. Please try again later.",
    };
  }
}
