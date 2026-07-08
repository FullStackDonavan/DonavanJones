import { requireAdmin } from '~~/server/app/services/adminService'
import { getAllInvoices } from '~~/server/database/repositories/invoiceRepository'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return await getAllInvoices()
})
