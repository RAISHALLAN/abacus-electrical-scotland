import { db } from './firebase'
import { ref, push, set, get, update, remove, query, orderByChild, onValue } from 'firebase/database'

// ==================== WORK TYPES ====================

export const getWorkTypes = async () => {
  try {
    const workTypesRef = ref(db, 'workTypes')
    const snapshot = await get(workTypesRef)
    if (snapshot.exists()) {
      return Object.values(snapshot.val())
    }
    return []
  } catch (error) {
    console.error('Error fetching work types:', error)
    return []
  }
}

export const subscribeToWorkTypes = (callback) => {
  const workTypesRef = ref(db, 'workTypes')
  return onValue(workTypesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      callback(Object.entries(data).map(([id, value]) => ({ id, ...value })))
    } else {
      callback([])
    }
  })
}

export const addWorkType = async (workType) => {
  try {
    const workTypesRef = ref(db, 'workTypes')
    const newWorkTypeRef = push(workTypesRef)
    await set(newWorkTypeRef, {
      name: workType.name,
      description: workType.description || '',
      createdAt: new Date().toISOString(),
    })
    return { id: newWorkTypeRef.key, ...workType }
  } catch (error) {
    console.error('Error adding work type:', error)
    throw error
  }
}

export const updateWorkType = async (id, updates) => {
  try {
    const workTypeRef = ref(db, `workTypes/${id}`)
    await update(workTypeRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating work type:', error)
    throw error
  }
}

export const deleteWorkType = async (id) => {
  try {
    const workTypeRef = ref(db, `workTypes/${id}`)
    await remove(workTypeRef)
  } catch (error) {
    console.error('Error deleting work type:', error)
    throw error
  }
}

// ==================== MATERIALS ====================

export const getMaterials = async () => {
  try {
    const materialsRef = ref(db, 'materials')
    const snapshot = await get(materialsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value }))
    }
    return []
  } catch (error) {
    console.error('Error fetching materials:', error)
    return []
  }
}

export const addMaterial = async (material) => {
  try {
    const materialsRef = ref(db, 'materials')
    const newMaterialRef = push(materialsRef)
    await set(newMaterialRef, {
      name: material.name,
      cost: parseFloat(material.cost),
      unit: material.unit || '',
      createdAt: new Date().toISOString(),
    })
    return { id: newMaterialRef.key, ...material }
  } catch (error) {
    console.error('Error adding material:', error)
    throw error
  }
}

export const updateMaterial = async (id, updates) => {
  try {
    const materialRef = ref(db, `materials/${id}`)
    await update(materialRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating material:', error)
    throw error
  }
}

export const deleteMaterial = async (id) => {
  try {
    const materialRef = ref(db, `materials/${id}`)
    await remove(materialRef)
  } catch (error) {
    console.error('Error deleting material:', error)
    throw error
  }
}

// ==================== LABOUR ====================

export const getLabour = async () => {
  try {
    const labourRef = ref(db, 'labour')
    const snapshot = await get(labourRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value }))
    }
    return []
  } catch (error) {
    console.error('Error fetching labour rates:', error)
    return []
  }
}

export const addLabour = async (labour) => {
  try {
    const labourRef = ref(db, 'labour')
    const newLabourRef = push(labourRef)
    await set(newLabourRef, {
      name: labour.name,
      cost: parseFloat(labour.cost),
      unit: labour.unit || 'per hour',
      createdAt: new Date().toISOString(),
    })
    return { id: newLabourRef.key, ...labour }
  } catch (error) {
    console.error('Error adding labour rate:', error)
    throw error
  }
}

export const updateLabour = async (id, updates) => {
  try {
    const labourRef = ref(db, `labour/${id}`)
    await update(labourRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating labour rate:', error)
    throw error
  }
}

export const deleteLabour = async (id) => {
  try {
    const labourRef = ref(db, `labour/${id}`)
    await remove(labourRef)
  } catch (error) {
    console.error('Error deleting labour rate:', error)
    throw error
  }
}

// ==================== QUOTE REQUESTS ====================

export const submitQuoteRequest = async (quoteRequest) => {
  try {
    const quoteRequestsRef = ref(db, 'quoteRequests')
    const newQuoteRef = push(quoteRequestsRef)
    await set(newQuoteRef, {
      ...quoteRequest,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    return { id: newQuoteRef.key, ...quoteRequest }
  } catch (error) {
    console.error('Error submitting quote request:', error)
    throw error
  }
}

export const getQuoteRequests = async () => {
  try {
    const quoteRequestsRef = ref(db, 'quoteRequests')
    const snapshot = await get(quoteRequestsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return []
  } catch (error) {
    console.error('Error fetching quote requests:', error)
    return []
  }
}

export const updateQuoteRequest = async (id, updates) => {
  try {
    const quoteRef = ref(db, `quoteRequests/${id}`)
    await update(quoteRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating quote request:', error)
    throw error
  }
}

// ==================== TESTIMONIALS ====================

export const getApprovedTestimonials = async () => {
  try {
    const testimonialsRef = ref(db, 'testimonials')
    const snapshot = await get(testimonialsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .filter(t => t.approved === true)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export const getPendingTestimonials = async () => {
  try {
    const testimonialsRef = ref(db, 'testimonials')
    const snapshot = await get(testimonialsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .filter(t => t.approved === false)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return []
  } catch (error) {
    console.error('Error fetching pending testimonials:', error)
    return []
  }
}

export const submitTestimonial = async (testimonial) => {
  try {
    const testimonialsRef = ref(db, 'testimonials')
    const newTestimonialRef = push(testimonialsRef)
    await set(newTestimonialRef, {
      name: testimonial.name,
      email: testimonial.email,
      rating: testimonial.rating,
      text: testimonial.text,
      approved: false,
      createdAt: new Date().toISOString(),
    })
    return { id: newTestimonialRef.key, ...testimonial }
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    throw error
  }
}

export const approveTestimonial = async (id) => {
  try {
    const testimonialRef = ref(db, `testimonials/${id}`)
    await update(testimonialRef, {
      approved: true,
      approvedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error approving testimonial:', error)
    throw error
  }
}

export const rejectTestimonial = async (id) => {
  try {
    const testimonialRef = ref(db, `testimonials/${id}`)
    await remove(testimonialRef)
  } catch (error) {
    console.error('Error rejecting testimonial:', error)
    throw error
  }
}

export const updateTestimonial = async (id, updates) => {
  try {
    const testimonialRef = ref(db, `testimonials/${id}`)
    await update(testimonialRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating testimonial:', error)
    throw error
  }
}

// ==================== PROMOTIONS ====================

export const getActivePromotions = async () => {
  try {
    const promotionsRef = ref(db, 'promotions')
    const snapshot = await get(promotionsRef)
    if (snapshot.exists()) {
      const promos = Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value }))
      const now = new Date()
      return promos.filter(p => p.active && new Date(p.validUntil) >= now)
    }
    return []
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return []
  }
}

export const getAllPromotions = async () => {
  try {
    const promotionsRef = ref(db, 'promotions')
    const snapshot = await get(promotionsRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return []
  } catch (error) {
    console.error('Error fetching promotions:', error)
    return []
  }
}

export const addPromotion = async (promotion) => {
  try {
    const promotionsRef = ref(db, 'promotions')
    const newPromoRef = push(promotionsRef)
    await set(newPromoRef, {
      title: promotion.title,
      description: promotion.description,
      discount: promotion.discount,
      validUntil: promotion.validUntil,
      active: true,
      createdAt: new Date().toISOString(),
    })
    return { id: newPromoRef.key, ...promotion }
  } catch (error) {
    console.error('Error adding promotion:', error)
    throw error
  }
}

export const updatePromotion = async (id, updates) => {
  try {
    const promotionRef = ref(db, `promotions/${id}`)
    await update(promotionRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating promotion:', error)
    throw error
  }
}

export const deletePromotion = async (id) => {
  try {
    const promotionRef = ref(db, `promotions/${id}`)
    await remove(promotionRef)
  } catch (error) {
    console.error('Error deleting promotion:', error)
    throw error
  }
}

// ==================== GENERATED QUOTES ====================

export const saveGeneratedQuote = async (quote) => {
  try {
    const quotesRef = ref(db, 'generatedQuotes')
    const newQuoteRef = push(quotesRef)
    await set(newQuoteRef, {
      ...quote,
      createdAt: new Date().toISOString(),
    })
    return { id: newQuoteRef.key, ...quote }
  } catch (error) {
    console.error('Error saving quote:', error)
    throw error
  }
}

export const getGeneratedQuotes = async () => {
  try {
    const quotesRef = ref(db, 'generatedQuotes')
    const snapshot = await get(quotesRef)
    if (snapshot.exists()) {
      return Object.entries(snapshot.val())
        .map(([id, value]) => ({ id, ...value }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    return []
  } catch (error) {
    console.error('Error fetching generated quotes:', error)
    return []
  }
}
