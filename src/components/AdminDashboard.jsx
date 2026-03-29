import { useState, useEffect } from 'react'
import {
  getWorkTypes,
  addWorkType,
  updateWorkType,
  deleteWorkType,
  getMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getLabour,
  addLabour,
  updateLabour,
  deleteLabour,
  getQuoteRequests,
  updateQuoteRequest,
  deleteQuoteRequest,
  getPendingTestimonials,
  getApprovedTestimonials,
  approveTestimonial,
  rejectTestimonial,
  getAllPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getGalleryImages, addGalleryImage, deleteGalleryImage,
  getBeforeAfterPairs, addBeforeAfterPair, deleteBeforeAfterPair,
} from '../utils/firebaseHelpers'
import { generateQuotePDF } from '../utils/pdfGenerator'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('quotes')
  const [loading, setLoading] = useState(true)
  const [bannerDesign, setBannerDesign] = useState('design-wires')
  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', tiktok: '', youtube: '' })
  const [savingSocial, setSavingSocial] = useState(false)
  const [socialSaved, setSocialSaved] = useState(false)

  // Quote Requests State
  const [quotes, setQuotes] = useState([])
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [quoteGeneratorData, setQuoteGeneratorData] = useState(null)
  const [quoteItems, setQuoteItems] = useState([])
  const [quoteDiscount, setQuoteDiscount] = useState(0)
  const [quoteNotes, setQuoteNotes] = useState('')
  const [generatingPDF, setGeneratingPDF] = useState(false)

  // Work Types State
  const [workTypes, setWorkTypes] = useState([])
  const [newWorkType, setNewWorkType] = useState({ name: '', description: '' })
  const [editingWorkType, setEditingWorkType] = useState(null)

  // Materials State
  const [materials, setMaterials] = useState([])
  const [newMaterial, setNewMaterial] = useState({ name: '', cost: '' })
  const [editingMaterial, setEditingMaterial] = useState(null)

  // Labour State
  const [labour, setLabour] = useState([])
  const [newLabour, setNewLabour] = useState({ name: '', cost: '' })
  const [editingLabour, setEditingLabour] = useState(null)

  // Testimonials State
  const [pendingTestimonials, setPendingTestimonials] = useState([])
  const [approvedTestimonials, setApprovedTestimonials] = useState([])

  // Promotions State
  const [promotions, setPromotions] = useState([])
  const [newPromotion, setNewPromotion] = useState({
    title: '',
    description: '',
    discount: '',
    validUntil: '',
  })
  const [editingPromotion, setEditingPromotion] = useState(null)

  // Gallery State
  const [galleryImages, setGalleryImages] = useState([])
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'Domestic', description: '', file: null })
  const [uploadingGallery, setUploadingGallery] = useState(false)

  // Before/After State
  const [beforeAfterPairs, setBeforeAfterPairs] = useState([])
  const [newBAItem, setNewBAItem] = useState({ title: '', category: 'Domestic', description: '', beforeFile: null, afterFile: null })
  const [uploadingBA, setUploadingBA] = useState(false)

  // Load banner design and social links on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { ref, get } = await import('firebase/database')
        const { db } = await import('../utils/firebase')
        const designRef = ref(db, 'settings/bannerDesign')
        const snapshot = await get(designRef)
        if (snapshot.exists()) {
          setBannerDesign(snapshot.val())
        }
        const socialRef = ref(db, 'settings/socialLinks')
        const socialSnap = await get(socialRef)
        if (socialSnap.exists()) {
          setSocialLinks({ facebook: '', instagram: '', tiktok: '', youtube: '', ...socialSnap.val() })
        }
      } catch (error) {
        console.log('Using default settings')
      }
    }
    loadSettings()
  }, [])

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        if (activeTab === 'quotes') {
          const data = await getQuoteRequests()
          setQuotes(data)
        } else if (activeTab === 'workTypes') {
          const data = await getWorkTypes()
          setWorkTypes(data)
        } else if (activeTab === 'materials') {
          const data = await getMaterials()
          setMaterials(data)
        } else if (activeTab === 'labour') {
          const data = await getLabour()
          setLabour(data)
        } else if (activeTab === 'testimonials') {
          const pending = await getPendingTestimonials()
          const approved = await getApprovedTestimonials()
          setPendingTestimonials(pending)
          setApprovedTestimonials(approved)
        } else if (activeTab === 'promotions') {
          const data = await getAllPromotions()
          setPromotions(data)
        } else if (activeTab === 'gallery') {
          const data = await getGalleryImages()
          setGalleryImages(data)
        } else if (activeTab === 'beforeAfter') {
          const data = await getBeforeAfterPairs()
          setBeforeAfterPairs(data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [activeTab])

  // ==================== WORK TYPES ====================

  const handleAddWorkType = async (e) => {
    e.preventDefault()
    if (!newWorkType.name) return
    try {
      if (editingWorkType) {
        // Update existing work type
        await updateWorkType(editingWorkType.name, newWorkType)
        setEditingWorkType(null)
      } else {
        // Add new work type
        await addWorkType(newWorkType)
      }
      setNewWorkType({ name: '', description: '' })
      const data = await getWorkTypes()
      setWorkTypes(data)
    } catch (error) {
      console.error('Error saving work type:', error)
    }
  }

  const handleEditWorkType = (workType) => {
    setEditingWorkType(workType)
    setNewWorkType({ name: workType.name, description: workType.description })
  }

  const handleCancelEditWorkType = () => {
    setEditingWorkType(null)
    setNewWorkType({ name: '', description: '' })
  }

  const handleDeleteWorkType = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteWorkType(id)
      const data = await getWorkTypes()
      setWorkTypes(data)
    } catch (error) {
      console.error('Error deleting work type:', error)
    }
  }

  // ==================== MATERIALS ====================

  const handleAddMaterial = async (e) => {
    e.preventDefault()
    if (!newMaterial.name || !newMaterial.cost) return
    try {
      await addMaterial(newMaterial)
      setNewMaterial({ name: '', cost: '' })
      const data = await getMaterials()
      setMaterials(data)
    } catch (error) {
      console.error('Error adding material:', error)
    }
  }

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteMaterial(id)
      const data = await getMaterials()
      setMaterials(data)
    } catch (error) {
      console.error('Error deleting material:', error)
    }
  }

  // ==================== LABOUR ====================

  const handleAddLabour = async (e) => {
    e.preventDefault()
    if (!newLabour.name || !newLabour.cost) return
    try {
      await addLabour(newLabour)
      setNewLabour({ name: '', cost: '' })
      const data = await getLabour()
      setLabour(data)
    } catch (error) {
      console.error('Error adding labour rate:', error)
    }
  }

  const handleDeleteLabour = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await deleteLabour(id)
      const data = await getLabour()
      setLabour(data)
    } catch (error) {
      console.error('Error deleting labour rate:', error)
    }
  }

  // ==================== TESTIMONIALS ====================

  const handleApproveTestimonial = async (id) => {
    try {
      await approveTestimonial(id)
      const pending = await getPendingTestimonials()
      const approved = await getApprovedTestimonials()
      setPendingTestimonials(pending)
      setApprovedTestimonials(approved)
    } catch (error) {
      console.error('Error approving testimonial:', error)
    }
  }

  const handleRejectTestimonial = async (id) => {
    if (!confirm('Reject this testimonial?')) return
    try {
      await rejectTestimonial(id)
      const pending = await getPendingTestimonials()
      setPendingTestimonials(pending)
    } catch (error) {
      console.error('Error rejecting testimonial:', error)
    }
  }

  // ==================== PROMOTIONS ====================

  const handleAddPromotion = async (e) => {
    e.preventDefault()
    if (!newPromotion.title || !newPromotion.validUntil) return
    try {
      await addPromotion(newPromotion)
      setNewPromotion({ title: '', description: '', discount: '', validUntil: '' })
      const data = await getAllPromotions()
      setPromotions(data)
    } catch (error) {
      console.error('Error adding promotion:', error)
    }
  }

  const handleDeletePromotion = async (id) => {
    if (!confirm('Are you sure?')) return
    try {
      await deletePromotion(id)
      const data = await getAllPromotions()
      setPromotions(data)
    } catch (error) {
      console.error('Error deleting promotion:', error)
    }
  }

  // ==================== QUOTE GENERATOR ====================

  const handleOpenQuoteGenerator = (quote) => {
    setQuoteGeneratorData(quote)
    setQuoteItems([])
    setQuoteDiscount(0)
    setQuoteNotes('')
  }

  const handleDeleteQuote = async (quoteId) => {
    if (!confirm('Are you sure you want to delete this quote request? This action cannot be undone.')) return
    try {
      await deleteQuoteRequest(quoteId)
      const data = await getQuoteRequests()
      setQuotes(data)
    } catch (error) {
      console.error('Error deleting quote:', error)
      alert('Error deleting quote. Please try again.')
    }
  }

  const handleDownloadQuotePDF = async () => {
    if (!quoteGeneratorData) return
    try {
      setGeneratingPDF(true)
      const subtotal = quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0)
      const discountAmount = (subtotal * quoteDiscount) / 100
      const total = subtotal - discountAmount

      const quoteData = {
        id: quoteGeneratorData.id,
        customerName: quoteGeneratorData.customerName,
        customerEmail: quoteGeneratorData.customerEmail,
        customerPhone: quoteGeneratorData.customerPhone,
        customerAddress: quoteGeneratorData.customerAddress,
        customerCity: quoteGeneratorData.city || quoteGeneratorData.customerCity || '',
        customerPostcode: quoteGeneratorData.postcode || quoteGeneratorData.customerPostcode || '',
        workType: quoteGeneratorData.workType,
        workDescription: quoteGeneratorData.workDescription,
        items: quoteItems,
        subtotal,
        discount: discountAmount,
        discountPercent: quoteDiscount,
        total,
        notes: quoteNotes,
      }
      await generateQuotePDF(quoteData, `Quote-${quoteGeneratorData.customerName.replace(/\s+/g, '-')}.pdf`)
      alert('Quote PDF downloaded successfully!')
      setQuoteGeneratorData(null)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF')
    } finally {
      setGeneratingPDF(false)
    }
  }

  // ==================== GALLERY ====================

  const handleAddGalleryImage = async (e) => {
    e.preventDefault()
    if (!newGalleryItem.file) return
    setUploadingGallery(true)
    try {
      await addGalleryImage(newGalleryItem)
      setNewGalleryItem({ title: '', category: 'Domestic', description: '', file: null })
      // reset file input
      const fileInput = document.getElementById('gallery-file-input')
      if (fileInput) fileInput.value = ''
      const data = await getGalleryImages()
      setGalleryImages(data)
    } catch (error) {
      console.error('Error uploading gallery image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploadingGallery(false)
    }
  }

  const handleDeleteGalleryImage = async (id) => {
    if (!confirm('Delete this image from the gallery?')) return
    try {
      await deleteGalleryImage(id)
      const data = await getGalleryImages()
      setGalleryImages(data)
    } catch (error) {
      console.error('Error deleting gallery image:', error)
    }
  }

  // ==================== BEFORE / AFTER ====================

  const handleAddBeforeAfterPair = async (e) => {
    e.preventDefault()
    if (!newBAItem.beforeFile || !newBAItem.afterFile) return
    setUploadingBA(true)
    try {
      await addBeforeAfterPair(newBAItem)
      setNewBAItem({ title: '', category: 'Domestic', description: '', beforeFile: null, afterFile: null })
      const beforeInput = document.getElementById('ba-before-input')
      const afterInput = document.getElementById('ba-after-input')
      if (beforeInput) beforeInput.value = ''
      if (afterInput) afterInput.value = ''
      const data = await getBeforeAfterPairs()
      setBeforeAfterPairs(data)
    } catch (error) {
      console.error('Error uploading before/after pair:', error)
      alert('Error uploading images. Please try again.')
    } finally {
      setUploadingBA(false)
    }
  }

  const handleDeleteBeforeAfterPair = async (id) => {
    if (!confirm('Delete this before/after pair?')) return
    try {
      await deleteBeforeAfterPair(id)
      const data = await getBeforeAfterPairs()
      setBeforeAfterPairs(data)
    } catch (error) {
      console.error('Error deleting before/after pair:', error)
    }
  }

  const handleSaveSocialLinks = async () => {
    setSavingSocial(true)
    try {
      const { ref, set } = await import('firebase/database')
      const { db } = await import('../utils/firebase')
      await set(ref(db, 'settings/socialLinks'), socialLinks)
      setSocialSaved(true)
      setTimeout(() => window.location.reload(), 800)
    } catch (error) {
      console.error('Error saving social links:', error)
      alert('Error saving social links. Please try again.')
    } finally {
      setSavingSocial(false)
    }
  }

  const handleBannerDesignChange = async (newDesign) => {
    try {
      const { ref, set } = await import('firebase/database')
      const { db } = await import('../utils/firebase')
      await set(ref(db, 'settings/bannerDesign'), newDesign)
      setBannerDesign(newDesign)
      // Force page reload to apply design change
      setTimeout(() => window.location.reload(), 500)
    } catch (error) {
      console.error('Error updating banner design:', error)
    }
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['quotes', 'workTypes', 'gallery', 'beforeAfter', 'testimonials', 'promotions', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn' : 'btn btn-secondary'}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            {tab === 'quotes' && 'Quote Requests'}
            {tab === 'workTypes' && 'Work Types'}
            {tab === 'gallery' && 'Gallery'}
            {tab === 'beforeAfter' && 'Before & After'}
            {tab === 'testimonials' && 'Testimonials'}
            {tab === 'promotions' && 'Promotions'}
            {tab === 'settings' && 'Settings'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {/* QUOTE REQUESTS */}
          {activeTab === 'quotes' && (
            <div>
              <h3 className="section-title">Quote Requests ({quotes.length})</h3>
              {quotes.length === 0 ? (
                <div className="card">No quote requests yet.</div>
              ) : (
                <div className="grid grid-1">
                  {quotes.map(quote => (
                    <div key={quote.id} className="card">
                      <h4>{quote.customerName}</h4>
                      <p><strong>Email:</strong> {quote.customerEmail}</p>
                      <p><strong>Phone:</strong> {quote.customerPhone}</p>
                      <p><strong>Address:</strong> {quote.customerAddress}</p>
                      <p><strong>Work Type:</strong> {quote.workType}</p>
                      <p><strong>Description:</strong> {quote.workDescription}</p>
                      <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => handleOpenQuoteGenerator(quote)} className="btn btn-small">
                          Generate Quote
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote.id)}
                          className="btn btn-secondary btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WORK TYPES */}
          {activeTab === 'workTypes' && (
            <div>
              <h3 className="section-title">Work Types ({workTypes.length})</h3>
              <form onSubmit={handleAddWorkType} className="card" style={{ marginBottom: '2rem' }}>
                <h4>{editingWorkType ? '✏️ Edit Work Type' : 'Add New Work Type'}</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newWorkType.name}
                    onChange={e => setNewWorkType({ ...newWorkType, name: e.target.value })}
                    placeholder="e.g., Domestic Wiring"
                    disabled={editingWorkType}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newWorkType.description}
                    onChange={e => setNewWorkType({ ...newWorkType, description: e.target.value })}
                    placeholder="Description of this work type"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn">
                    {editingWorkType ? 'Save Changes' : 'Add Work Type'}
                  </button>
                  {editingWorkType && (
                    <button
                      type="button"
                      onClick={handleCancelEditWorkType}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              <div className="grid grid-2">
                {workTypes.map(type => (
                  <div key={type.name} className="card">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEditWorkType(type)}
                        className="btn btn-small"
                        style={{ backgroundColor: 'rgba(37, 99, 235, 0.2)', color: 'var(--color-accent)' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteWorkType(type.name)}
                        className="btn btn-secondary btn-small"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <h3 className="section-title">Gallery ({galleryImages.length})</h3>

              <form onSubmit={handleAddGalleryImage} className="card" style={{ marginBottom: '2rem' }}>
                <h4>Upload New Image</h4>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newGalleryItem.title}
                      onChange={e => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                      placeholder="e.g., Kitchen Rewire"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={e => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Testing & Inspection">Testing &amp; Inspection</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newGalleryItem.description}
                    onChange={e => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                    placeholder="Brief description of the project"
                  />
                </div>
                <div className="form-group">
                  <label>Image File *</label>
                  <input
                    id="gallery-file-input"
                    type="file"
                    accept="image/*"
                    onChange={e => setNewGalleryItem({ ...newGalleryItem, file: e.target.files[0] || null })}
                    required
                    style={{ color: 'var(--color-text)' }}
                  />
                </div>
                <button type="submit" className="btn" disabled={uploadingGallery}>
                  {uploadingGallery ? 'Uploading...' : 'Upload Image'}
                </button>
              </form>

              {galleryImages.length === 0 ? (
                <div className="card">No gallery images yet. Upload one above.</div>
              ) : (
                <div className="grid grid-3">
                  {galleryImages.map(img => (
                    <div key={img.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                      <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '0.75rem' }}>
                        <h5 style={{ marginBottom: '0.2rem' }}>{img.title}</h5>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.3rem' }}>{img.category}</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: '0.75rem' }}>{img.description}</p>
                        <button
                          onClick={() => handleDeleteGalleryImage(img.id)}
                          className="btn btn-secondary btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BEFORE / AFTER */}
          {activeTab === 'beforeAfter' && (
            <div>
              <h3 className="section-title">Before &amp; After ({beforeAfterPairs.length})</h3>

              <form onSubmit={handleAddBeforeAfterPair} className="card" style={{ marginBottom: '2rem' }}>
                <h4>Upload New Pair</h4>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newBAItem.title}
                      onChange={e => setNewBAItem({ ...newBAItem, title: e.target.value })}
                      placeholder="e.g., Full House Rewire"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newBAItem.category}
                      onChange={e => setNewBAItem({ ...newBAItem, category: e.target.value })}
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Testing & Inspection">Testing &amp; Inspection</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newBAItem.description}
                    onChange={e => setNewBAItem({ ...newBAItem, description: e.target.value })}
                    placeholder="Brief description of the transformation"
                  />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Before Image *</label>
                    <input
                      id="ba-before-input"
                      type="file"
                      accept="image/*"
                      onChange={e => setNewBAItem({ ...newBAItem, beforeFile: e.target.files[0] || null })}
                      required
                      style={{ color: 'var(--color-text)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>After Image *</label>
                    <input
                      id="ba-after-input"
                      type="file"
                      accept="image/*"
                      onChange={e => setNewBAItem({ ...newBAItem, afterFile: e.target.files[0] || null })}
                      required
                      style={{ color: 'var(--color-text)' }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn" disabled={uploadingBA}>
                  {uploadingBA ? 'Uploading...' : 'Upload Pair'}
                </button>
              </form>

              {beforeAfterPairs.length === 0 ? (
                <div className="card">No before/after pairs yet. Upload one above.</div>
              ) : (
                <div className="grid grid-2">
                  {beforeAfterPairs.map(pair => (
                    <div key={pair.id} className="card">
                      <h5 style={{ marginBottom: '0.2rem' }}>{pair.title}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>{pair.category}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <div>
                          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem', textAlign: 'center' }}>BEFORE</p>
                          <img src={pair.beforeUrl} alt="before" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.3rem', textAlign: 'center' }}>AFTER</p>
                          <img src={pair.afterUrl} alt="after" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', opacity: 0.75, marginBottom: '0.75rem' }}>{pair.description}</p>
                      <button
                        onClick={() => handleDeleteBeforeAfterPair(pair.id)}
                        className="btn btn-secondary btn-small"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div>
              <h3 className="section-title">Testimonials</h3>

              {/* Pending */}
              <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                Pending Approval ({pendingTestimonials.length})
              </h4>
              {pendingTestimonials.length === 0 ? (
                <div className="card" style={{ marginBottom: '2rem' }}>No pending testimonials</div>
              ) : (
                <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                  {pendingTestimonials.map(test => (
                    <div key={test.id} className="card">
                      <h5>{test.name}</h5>
                      <p style={{ fontSize: '0.9rem' }}>
                        {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)} ({test.rating}/5)
                      </p>
                      <p>"{test.text}"</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApproveTestimonial(test.id)}
                          className="btn btn-small"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectTestimonial(test.id)}
                          className="btn btn-secondary btn-small"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Approved */}
              <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                Approved ({approvedTestimonials.length})
              </h4>
              {approvedTestimonials.length === 0 ? (
                <div className="card">No approved testimonials yet.</div>
              ) : (
                <div className="grid grid-2">
                  {approvedTestimonials.map(test => (
                    <div key={test.id} className="card">
                      <h5>{test.name}</h5>
                      <p style={{ fontSize: '0.9rem' }}>
                        {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)} ({test.rating}/5)
                      </p>
                      <p style={{ marginBottom: '0.5rem' }}>"{test.text}"</p>
                      <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>
                        {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : ''}
                      </p>
                      <button
                        onClick={() => handleRejectTestimonial(test.id)}
                        className="btn btn-secondary btn-small"
                      >
                        Remove from Site
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROMOTIONS */}
          {activeTab === 'promotions' && (
            <div>
              <h3 className="section-title">Promotions ({promotions.length})</h3>
              <form onSubmit={handleAddPromotion} className="card" style={{ marginBottom: '2rem' }}>
                <h4>Add New Promotion</h4>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newPromotion.title}
                    onChange={e => setNewPromotion({ ...newPromotion, title: e.target.value })}
                    placeholder="e.g., Spring Special"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newPromotion.description}
                    onChange={e => setNewPromotion({ ...newPromotion, description: e.target.value })}
                    placeholder="Describe the promotion"
                  />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Discount/Offer</label>
                    <input
                      type="text"
                      value={newPromotion.discount}
                      onChange={e => setNewPromotion({ ...newPromotion, discount: e.target.value })}
                      placeholder="e.g., 10% or Free"
                    />
                  </div>
                  <div className="form-group">
                    <label>Valid Until</label>
                    <input
                      type="date"
                      value={newPromotion.validUntil}
                      onChange={e => setNewPromotion({ ...newPromotion, validUntil: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn">Add Promotion</button>
              </form>

              <div className="grid grid-2">
                {promotions.map(promo => (
                  <div key={promo.id} className="card">
                    <h4>{promo.title}</h4>
                    <p>{promo.description}</p>
                    <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                      {promo.discount}
                    </p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                      Until: {new Date(promo.validUntil).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleDeletePromotion(promo.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="section-title">Website Settings</h3>

              {/* Banner Design Selection */}
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h4>Banner Design</h4>
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>Choose how the header banner looks</p>

                <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  {/* Design Option 1: Electric Wire Pattern */}
                  <div
                    className="card"
                    style={{
                      border: bannerDesign === 'design-wires' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0.75rem'
                    }}
                    onClick={() => handleBannerDesignChange('design-wires')}
                  >
                    <h5 style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>⚡ Wire Pattern</h5>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                      Animated electrical wire pattern.
                    </p>
                    <div
                      style={{
                        height: '70px',
                        background: '#000',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        color: 'var(--color-accent)',
                        fontSize: '0.8rem'
                      }}
                    >
                      Preview
                    </div>
                    <button
                      className={bannerDesign === 'design-wires' ? 'btn' : 'btn btn-secondary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBannerDesignChange('design-wires')
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      {bannerDesign === 'design-wires' ? '✓' : 'Select'}
                    </button>
                  </div>

                  {/* Design Option 2: Lightning Strike Effect */}
                  <div
                    className="card"
                    style={{
                      border: bannerDesign === 'design-logo' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0.75rem'
                    }}
                    onClick={() => handleBannerDesignChange('design-logo')}
                  >
                    <h5 style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>⚡ Lightning</h5>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                      Dynamic lightning strikes.
                    </p>
                    <div
                      style={{
                        height: '70px',
                        background: '#000',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginBottom: '0.5rem',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2) inset'
                      }}
                    >
                      <div style={{ width: '2px', height: '60%', background: 'white', borderRadius: '1px' }}></div>
                      <div style={{ width: '2px', height: '50%', background: 'white', borderRadius: '1px' }}></div>
                      <div style={{ width: '2px', height: '70%', background: 'white', borderRadius: '1px' }}></div>
                    </div>
                    <button
                      className={bannerDesign === 'design-logo' ? 'btn' : 'btn btn-secondary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBannerDesignChange('design-logo')
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      {bannerDesign === 'design-logo' ? '✓' : 'Select'}
                    </button>
                  </div>

                  {/* Design Option 3: Interlocking Wires Pattern */}
                  <div
                    className="card"
                    style={{
                      border: bannerDesign === 'design-wires-custom' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0.75rem'
                    }}
                    onClick={() => handleBannerDesignChange('design-wires-custom')}
                  >
                    <h5 style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>🔌 Wires</h5>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                      Interlocking wires pattern.
                    </p>
                    <div
                      style={{
                        height: '70px',
                        background: '#000 url(/Wires-Pattern.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ opacity: 0.3, color: 'white', fontSize: '0.8rem' }}>Preview</div>
                    </div>
                    <button
                      className={bannerDesign === 'design-wires-custom' ? 'btn' : 'btn btn-secondary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBannerDesignChange('design-wires-custom')
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      {bannerDesign === 'design-wires-custom' ? '✓' : 'Select'}
                    </button>
                  </div>

                  {/* Design Option 4: Subtle Website */}
                  <div
                    className="card"
                    style={{
                      border: bannerDesign === 'design-circuit' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      padding: '0.75rem'
                    }}
                    onClick={() => handleBannerDesignChange('design-circuit')}
                  >
                    <h5 style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>✨ Subtle</h5>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.5rem' }}>
                      Clean with logo background.
                    </p>
                    <div
                      style={{
                        height: '70px',
                        background: '#000',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <div style={{ opacity: 0.3, color: 'white', fontSize: '0.8rem' }}>Preview</div>
                    </div>
                    <button
                      className={bannerDesign === 'design-circuit' ? 'btn' : 'btn btn-secondary'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBannerDesignChange('design-circuit')
                      }}
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                    >
                      {bannerDesign === 'design-circuit' ? '✓' : 'Select'}
                    </button>
                  </div>
                </div>

                <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
                  💡 Tip: All designs fade behind navigation text for readability. The page will reload when you change the design.
                </p>
              </div>

              {/* Social Media Links */}
              <div className="card">
                <h4 style={{ marginBottom: '0.5rem' }}>Social Media Links</h4>
                <p style={{ marginBottom: '1.25rem', opacity: 0.8, fontSize: '0.9rem' }}>
                  Enter your profile URLs below. Leave blank to hide that platform from the footer.
                </p>
                <div className="grid grid-2">
                  {[
                    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://www.facebook.com/yourpage' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/yourhandle' },
                    { key: 'tiktok',    label: 'TikTok',    placeholder: 'https://www.tiktok.com/@yourhandle' },
                    { key: 'youtube',   label: 'YouTube',   placeholder: 'https://www.youtube.com/@yourchannel' },
                  ].map(({ key, label, placeholder }) => (
                    <div className="form-group" key={key}>
                      <label>{label}</label>
                      <input
                        type="url"
                        value={socialLinks[key]}
                        onChange={e => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={handleSaveSocialLinks} className="btn" disabled={savingSocial}>
                    {savingSocial ? 'Saving...' : 'Save Social Links'}
                  </button>
                  {socialSaved && (
                    <span style={{ color: '#4ade80', fontSize: '0.9rem' }}>✓ Saved successfully</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* QUOTE GENERATOR MODAL */}
      {quoteGeneratorData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'var(--color-background)',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '95%',
            color: 'var(--color-text)',
          }}>
            <h2 style={{ marginTop: 0 }}>Generate Quote for {quoteGeneratorData.customerName}</h2>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Customer & Work Details</h3>
              <p><strong>Email:</strong> {quoteGeneratorData.customerEmail}</p>
              <p><strong>Phone:</strong> {quoteGeneratorData.customerPhone}</p>
              <p><strong>Address:</strong> {quoteGeneratorData.customerAddress}</p>
              <p><strong>Work Type:</strong> {quoteGeneratorData.workType}</p>
              <p><strong>Description:</strong> {quoteGeneratorData.workDescription}</p>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Quote Items</h3>
              {quoteItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px', alignItems: 'center' }}>
                  <span style={{ minWidth: '28px', height: '28px', backgroundColor: 'var(--color-accent)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 }}>{idx + 1}</span>
                  <input type="text" value={item.description} onChange={(e) => {
                    const newItems = [...quoteItems]
                    newItems[idx].description = e.target.value
                    setQuoteItems(newItems)
                  }} style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid var(--color-accent)' }} placeholder="Description" />
                  <input type="number" value={item.quantity} onChange={(e) => {
                    const newItems = [...quoteItems]
                    newItems[idx].quantity = parseInt(e.target.value) || 1
                    setQuoteItems(newItems)
                  }} style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid var(--color-accent)' }} />
                  <input type="number" step="0.01" value={item.unitCost} onChange={(e) => {
                    const newItems = [...quoteItems]
                    newItems[idx].unitCost = parseFloat(e.target.value) || 0
                    setQuoteItems(newItems)
                  }} style={{ width: '90px', padding: '5px', borderRadius: '4px', border: '1px solid var(--color-accent)' }} />
                  <span style={{ width: '100px', textAlign: 'right', alignSelf: 'center', fontWeight: 'bold' }}>£{(item.quantity * item.unitCost).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <button onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== idx))} style={{ padding: '5px 10px', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
              <button onClick={() => setQuoteItems([...quoteItems, { description: '', quantity: 1, unitCost: 0 }])} className="btn btn-small">+ Add Item</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card">
                <h3>Notes</h3>
                <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} placeholder="Additional notes..." style={{ width: '100%', height: '120px', padding: '10px', border: '1px solid var(--color-accent)', borderRadius: '4px', backgroundColor: 'rgba(0,0,0,0.2)', color: 'var(--color-text)', fontFamily: 'inherit' }} />
              </div>
              <div className="card">
                <h3>Totals</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Subtotal:</span>
                  <span>£{quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Discount %:</span>
                  <input type="number" min="0" max="100" value={quoteDiscount} onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)} style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid var(--color-accent)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'rgba(37,99,235,0.2)', borderRadius: '4px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  <span>TOTAL:</span>
                  <span>£{(quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0) * (1 - quoteDiscount / 100)).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setQuoteGeneratorData(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleDownloadQuotePDF} disabled={generatingPDF} className="btn" style={{ opacity: generatingPDF ? 0.6 : 1 }}>{generatingPDF ? 'Generating...' : 'Download PDF'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
