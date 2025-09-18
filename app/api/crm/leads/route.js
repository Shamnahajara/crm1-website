import {  NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["first_name", "last_name", "email", "phone", "company", "message"]
    const missingFields = requiredFields.filter((field) => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json({ error: "Missing required fields", missing: missingFields }, { status: 400 })
    }

    // Here you would integrate with your actual CRM API
    // Examples: HubSpot, Salesforce, Pipedrive, etc.

    // For demonstration, we'll simulate a CRM API call
    const crmData = {
      ...body,
      lead_id: `LEAD_${Date.now()}`,
      status: "new",
      assigned_to: "Sales Team",
      priority: "medium",
      tags: ["website", "inbound"],
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Example CRM API integration (uncomment and modify for your CRM):
    /*
    const crmResponse = await fetch('https://api.your-crm.com/leads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crmData)
    })

    if (!crmResponse.ok) {
      throw new Error('CRM API request failed')
    }

    const crmResult = await crmResponse.json()
    */

    // For demo purposes, we'll return a success response
    const mockCrmResult = {
      success: true,
      lead_id: crmData.lead_id,
      message: "Lead successfully created in CRM",
      assigned_to: crmData.assigned_to,
      next_steps: "Our sales team will contact you within 24 hours",
    }

    return NextResponse.json(mockCrmResult, { status: 201 })
  } catch (error) {
    console.error("CRM API Error:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to process lead submission",
      },
      { status: 500 },
    )
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
