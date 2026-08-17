 "use client";

import { useFormStatus } from "react-dom";
import { upsertContent } from "@/app/admin/actions";
import { MediaPicker } from "./MediaPicker";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn-primary disabled:opacity-50">{pending ? "Saving..." : label}</button>;
}

type Props = {
  table: string;
  record?: Record<string, any> | null;
  title: string;
  media?: Array<{ id: string; file_name: string; file_url: string; alt_text?: string | null }>;
};

export function ContentForm({ table, record, title, media = [] }: Props) {
  const field = (name: string) => record?.[name] ?? "";
  const isProject = table === "projects";
  const isPage = table === "pages";
  const isPost = table === "posts";

  return (
    <form action={upsertContent} className="space-y-6">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={record?.id ?? ""} />

      <div className="card p-6">
        <h2 className="text-xl font-black">{record ? "Edit" : "Create"} {title}</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="label">Title</span>
            <input name="title" required defaultValue={field("title")} className="input" />
          </label>

          {!["volunteers", "donations"].includes(table) && (
            <label className="block">
              <span className="label">Slug</span>
              <input name="slug" defaultValue={field("slug")} placeholder="auto-generated if blank" className="input" />
            </label>
          )}

          {(table === "programs" || isProject) && (
            <label className="block">
              <span className="label">Category</span>
              <input name="category" defaultValue={field("category")} className="input" />
            </label>
          )}

          {isProject && (
            <>
              <label className="block"><span className="label">Location</span><input name="location" defaultValue={field("location")} className="input" /></label>
              <label className="block"><span className="label">Budget</span><input name="budget" type="number" min="0" step="0.01" defaultValue={field("budget")} className="input" /></label>
              <label className="block"><span className="label">Start date</span><input name="start_date" type="date" defaultValue={field("start_date")} className="input" /></label>
              <label className="block"><span className="label">End date</span><input name="end_date" type="date" defaultValue={field("end_date")} className="input" /></label>
            </>
          )}

          <label className="block">
            <span className="label">Status</span>
            <select name="status" defaultValue={field("status") || (table === "volunteers" ? "new" : table === "donations" ? "pending" : "draft")} className="input">
              {table === "volunteers" ? (
                <>
                  <option value="new">New</option><option value="contacted">Contacted</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
                </>
              ) : table === "donations" ? (
                <>
                  <option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
                </>
              ) : (
                <>
                  <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                </>
              )}
            </select>
          </label>

          {table === "programs" ? (
            <>
              <label className="block md:col-span-2"><span className="label">Summary</span><textarea name="summary" defaultValue={field("summary")} className="input min-h-24" /></label>
              <label className="block md:col-span-2"><span className="label">Description</span><textarea name="description" defaultValue={field("description")} className="input min-h-40" /></label>
              <div className="md:col-span-2">
                <span className="label">Program image</span>
                <MediaPicker media={media} name="image_url" initialUrl={field("image_url")} />
              </div>
            </>
          ) : isProject ? (
            <>
              <label className="block md:col-span-2"><span className="label">Summary</span><textarea name="summary" defaultValue={field("summary")} className="input min-h-24" /></label>
              <label className="block md:col-span-2"><span className="label">Description</span><textarea name="description" defaultValue={field("description")} className="input min-h-40" /></label>
              <label className="block md:col-span-2"><span className="label">Impact summary</span><textarea name="impact_summary" defaultValue={field("impact_summary")} className="input min-h-24" /></label>
              <div className="md:col-span-2">
                <span className="label">Featured image</span>
                <MediaPicker media={media} name="featured_image" initialUrl={field("featured_image")} />
              </div>
            </>
          ) : ["pages", "posts"].includes(table) ? (
            <>
              <label className="block md:col-span-2"><span className="label">Excerpt</span><textarea name="excerpt" defaultValue={field("excerpt")} className="input min-h-24" /></label>
              <label className="block md:col-span-2"><span className="label">Content</span><textarea name="content" defaultValue={field("content")} className="input min-h-64" /></label>
              <div className="md:col-span-2">
                <span className="label">Featured image</span>
                <MediaPicker media={media} name="featured_image" initialUrl={field("featured_image")} />
              </div>
              {isPage && <>
                <label className="block"><span className="label">SEO title</span><input name="seo_title" defaultValue={field("seo_title")} className="input" /></label>
                <label className="block"><span className="label">SEO description</span><input name="seo_description" defaultValue={field("seo_description")} className="input" /></label>
              </>}
            </>
          ) : table === "volunteers" ? (
            <>
              <label className="block"><span className="label">Email</span><input name="email" type="email" defaultValue={field("email")} className="input" /></label>
              <label className="block"><span className="label">Phone</span><input name="phone" defaultValue={field("phone")} className="input" /></label>
              <label className="block md:col-span-2"><span className="label">Interests</span><input name="interests" defaultValue={field("interests")} className="input" /></label>
              <label className="block md:col-span-2"><span className="label">Message</span><textarea name="message" defaultValue={field("message")} className="input min-h-32" /></label>
            </>
          ) : (
            <>
              <label className="block"><span className="label">Donor email</span><input name="donor_email" type="email" defaultValue={field("donor_email")} className="input" /></label>
              <label className="block"><span className="label">Amount</span><input name="amount" type="number" min="0" step="0.01" required defaultValue={field("amount")} className="input" /></label>
              <label className="block"><span className="label">Currency</span><input name="currency" defaultValue={field("currency") || "NPR"} className="input" /></label>
              <label className="block"><span className="label">Payment method</span><input name="payment_method" defaultValue={field("payment_method")} className="input" /></label>
              <label className="block"><span className="label">Transaction reference</span><input name="transaction_reference" defaultValue={field("transaction_reference")} className="input" /></label>
              <label className="block"><span className="label">Campaign</span><input name="campaign" defaultValue={field("campaign")} className="input" /></label>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <a href={`/admin/${table === "posts" ? "news" : table}`} className="btn-outline">Cancel</a>
        <SubmitButton label={record ? "Save changes" : "Create record"} />
      </div>
    </form>
  );
}
