// Shared by scripts/seed.ts and the one-off live apply script, so the
// baseline and the live page can't drift. Copy only states facts the
// client confirmed (delivery to the organization's site, invoices/records
// for reporting, monthly standing orders, custom lists incl. other staples)
// -- no prices, minimums, certifications, beneficiary counts or past NGO
// clients.

export const PRODUCT_BANNER_URL =
  "https://afyliettjdyjcavbaqgg.supabase.co/storage/v1/object/public/media/brand/e9b47d34-0eac-4ed4-a7c4-f740a2089c60.webp";

export const RATION_PAGE = {
  slug: "ration-packs",
  title: "Ration Packs",
  seo_title: "Monthly Ration Packs for NGOs & Welfare Organizations — Mehmed Super Foods",
  seo_description:
    "Custom monthly ration packs for NGOs and welfare organizations, built to your list and delivered to your warehouse or distribution site across Punjab.",
};

export const RATION_SECTIONS_BEFORE_CAROUSEL = [
  {
    type: "page_header",
    content: {
      title: "Ration Packs",
      heading: "Monthly **Ration Packs** for Welfare Organizations",
      body: "Custom ration packs built to your list and delivered to your warehouse or distribution site — month after month, for the organizations that serve families in need.",
    },
  },
  {
    type: "feature_grid",
    content: {
      heading: "Who This Service Is **For**",
      subheading: "Built for organizations that distribute ration to people in need.",
      style: "light",
      features: [
        { icon: "💞", title: "NGOs", description: "Organizations running regular ration distribution for families in need." },
        { icon: "🏛", title: "Welfare Trusts & Foundations", description: "Charitable trusts and foundations with monthly ration programmes." },
        { icon: "👥", title: "Community & Charitable Groups", description: "Local welfare groups and committees distributing ration in their communities." },
      ],
    },
  },
  {
    type: "feature_grid",
    content: {
      heading: "What Goes in a **Pack**",
      subheading: "You choose the items and quantities. We confirm the final list with you before packing.",
      style: "light",
      features: [
        { icon: "🌾", title: "Wheat Flour", description: "Mehmed flour in the pack size that suits your distribution." },
        { icon: "🍚", title: "Rice", description: "Mehmed rice varieties, packed for household ration." },
        { icon: "🫘", title: "Pulses", description: "Sourced to your pack list." },
        { icon: "🛢", title: "Cooking Oil", description: "Sourced to your pack list." },
        { icon: "🍬", title: "Sugar", description: "Sourced to your pack list." },
        { icon: "🍵", title: "Tea", description: "Sourced to your pack list." },
        { icon: "🌿", title: "Salt & Spices", description: "Sourced to your pack list." },
        { icon: "🥤", title: "Rizqan Juice", description: "Rizqan sugarcane juice can be added to your pack." },
      ],
    },
  },
  {
    type: "feature_grid",
    content: {
      heading: "How It **Works**",
      subheading: "A clear process from your requirement to your donor report.",
      style: "light",
      features: [
        { icon: "1️⃣", title: "Share Your Requirement", description: "Tell us the items, number of packs and delivery location." },
        { icon: "2️⃣", title: "Confirm the Pack List", description: "We confirm the list with you and send a quotation." },
        { icon: "3️⃣", title: "Packs Are Prepared", description: "Packs are made up to your agreed list." },
        { icon: "4️⃣", title: "Delivery to Your Site", description: "Delivered to your warehouse or distribution site." },
        { icon: "5️⃣", title: "Invoice & Records", description: "You receive an invoice and records for donor and audit reporting." },
      ],
    },
  },
  {
    type: "feature_grid",
    content: {
      heading: "Why Organizations Work With **Mehmed**",
      style: "light",
      features: [
        { icon: "📋", title: "Custom Pack Lists", description: "Packs are built to your list, not a fixed bundle." },
        { icon: "🔁", title: "Monthly Standing Orders", description: "Repeat the same pack every month, with the list adjustable." },
        { icon: "🏬", title: "Delivered to Your Site", description: "Delivery to your warehouse or distribution site across Punjab." },
        { icon: "🧾", title: "Invoices & Records", description: "Paperwork you can use for donor and audit reporting." },
        { icon: "🧼", title: "Hygienically Packed", description: "Every product is packed with hygiene and quality control in mind." },
        { icon: "🤝", title: "A Dedicated Point of Contact", description: "One team member for your organization's orders." },
      ],
    },
  },
  {
    type: "faq_accordion",
    content: {
      heading: "Ration Pack **Questions**",
      items: [
        {
          question: "Can we choose what goes in the packs?",
          answer:
            "Yes. Packs are built to your list. We agree the items and quantities with you before packing. Typical items include Mehmed flour and rice, plus other staples we source for your pack.",
        },
        {
          question: "How often can we order?",
          answer:
            "You can place a one-time order or a monthly standing order. A standing order repeats the same pack list every month, and you can adjust the list when your needs change.",
        },
        {
          question: "Where do you deliver?",
          answer:
            "We deliver to your warehouse or distribution site across Punjab. Add the delivery location in the request form and we will confirm it with you.",
        },
        {
          question: "Do you provide invoices and records?",
          answer: "Yes. You receive an invoice and records that you can use for your donor and audit reporting.",
        },
        {
          question: "Is there a fixed price or minimum order?",
          answer:
            "Every organization's pack list is different, so we quote against your list. Share your requirement through the form and we will confirm the details with you.",
        },
        {
          question: "How do we get started?",
          answer:
            "Fill in the request form below with your items, number of packs and delivery location. Our team will contact you to confirm the pack list and quotation.",
        },
      ],
    },
  },
];

export const RATION_SECTIONS_AFTER_CAROUSEL = [
  {
    type: "quote_form",
    content: {
      variant: "ration_pack",
      heading: "Request Your **Ration Packs**",
      body: "Tell us what your organization needs. We will contact you to confirm the pack list and quotation.",
      info_heading: "Please include:",
      info_items: [
        "Items you want in each pack",
        "Number of packs and how often",
        "Delivery location and city",
        "Your preferred delivery month",
      ],
    },
  },
  {
    type: "cta_banner",
    content: {
      image_url: PRODUCT_BANNER_URL,
      heading: "Planning Your Next **Distribution**?",
      body: "Let's build the right ration pack for the families you serve.",
      buttons: [
        { label: "View Products", href: "/products" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  },
];

export const HOME_RATION_TEASER = {
  type: "image_with_text",
  content: {
    heading: "Monthly **Ration Packs** for Welfare Organizations",
    body: "NGOs and welfare organizations can order custom ration packs built to their own list, delivered to their warehouse or distribution site, and repeated every month.",
    image_on_right: false,
    cta_label: "Explore Ration Packs",
    cta_href: "/ration-packs",
  },
};
