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
  getPendingTestimonials,
  getApprovedTestimonials,
  approveTestimonial,
  rejectTestimonial,
  getAllPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
} from '../utils/firebaseHelpers'
import { generateQuotePDF } from '../utils/pdfGenerator'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('quotes')
  const [loading, setLoading] = useState(true)
  const [bannerDesign, setBannerDesign] = useState('design-wires')

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

  // Load banner design on mount
  useEffect(() => {
    const loadDesign = async () => {
      try {
        const { ref, get } = await import('firebase/database')
        const { db } = await import('../utils/firebase')
        const designRef = ref(db, 'settings/bannerDesign')
        const snapshot = await get(designRef)
        if (snapshot.exists()) {
          setBannerDesign(snapshot.val())
        }
      } catch (error) {
        console.log('Using default design')
      }
    }
    loadDesign()
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
      await addWorkType(newWorkType)
      setNewWorkType({ name: '', description: '' })
      const data = await getWorkTypes()
      setWorkTypes(data)
    } catch (error) {
      console.error('Error adding work type:', error)
    }
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
        {['quotes', 'workTypes', 'materials', 'labour', 'testimonials', 'promotions', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn' : 'btn btn-secondary'}
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            {tab === 'quotes' && 'Quote Requests'}
            {tab === 'workTypes' && 'Work Types'}
            {tab === 'materials' && 'Materials'}
            {tab === 'labour' && 'Labour Rates'}
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
                      <button onClick={() => handleOpenQuoteGenerator(quote)} className="btn btn-small">
                        Generate Quote
                      </button>
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
                <h4>Add New Work Type</h4>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newWorkType.name}
                    onChange={e => setNewWorkType({ ...newWorkType, name: e.target.value })}
                    placeholder="e.g., Domestic Wiring"
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
                <button type="submit" className="btn">Add Work Type</button>
              </form>

              <div className="grid grid-2">
                {workTypes.map(type => (
                  <div key={type.name} className="card">
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                    <button
                      onClick={() => handleDeleteWorkType(type.name)}
                      className="btn btn-secondary btn-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {activeTab === 'materials' && (
            <div>
              <h3 className="section-title">Materials ({materials.length})</h3>
              <form onSubmit={handleAddMaterial} className="card" style={{ marginBottom: '2rem' }}>
                <h4>Add New Material</h4>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Material Name</label>
                    <input
                      type="text"
                      value={newMaterial.name}
                      onChange={e => setNewMaterial({ ...newMaterial, name: e.target.value })}
                      placeholder="e.g., Cable (per meter)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newMaterial.cost}
                      onChange={e => setNewMaterial({ ...newMaterial, cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <button type="submit" className="btn">Add Material</button>
              </form>

              <div className="grid grid-3">
                {materials.map(mat => (
                  <div key={mat.id} className="card">
                    <h4>{mat.name}</h4>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>£{mat.cost.toFixed(2)}</p>
                    <button
                      onClick={() => handleDeleteMaterial(mat.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LABOUR RATES */}
          {activeTab === 'labour' && (
            <div>
              <h3 className="section-title">Labour Rates ({labour.length})</h3>
              <form onSubmit={handleAddLabour} className="card" style={{ marginBottom: '2rem' }}>
                <h4>Add New Labour Rate</h4>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={newLabour.name}
                      onChange={e => setNewLabour({ ...newLabour, name: e.target.value })}
                      placeholder="e.g., Call Out Fee"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newLabour.cost}
                      onChange={e => setNewLabour({ ...newLabour, cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <button type="submit" className="btn">Add Labour Rate</button>
              </form>

              <div className="grid grid-3">
                {labour.map(rate => (
                  <div key={rate.id} className="card">
                    <h4>{rate.name}</h4>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>£{rate.cost.toFixed(2)}</p>
                    <button
                      onClick={() => handleDeleteLabour(rate.id)}
                      className="btn btn-secondary btn-small"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
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
                      <p style={{ fontSize: '0.9rem' }}>★★★★★ ({test.rating}/5)</p>
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
              <div className="grid grid-2">
                {approvedTestimonials.map(test => (
                  <div key={test.id} className="card">
                    <h5>{test.name}</h5>
                    <p style={{ fontSize: '0.9rem' }}>★★★★★ ({test.rating}/5)</p>
                    <p>"{test.text}"</p>
                  </div>
                ))}
              </div>
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
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
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
                  <span style={{ width: '100px', textAlign: 'right', alignSelf: 'center', fontWeight: 'bold' }}>£{(item.quantity * item.unitCost).toFixed(2)}</span>
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
                  <span>£{quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Discount %:</span>
                  <input type="number" min="0" max="100" value={quoteDiscount} onChange={(e) => setQuoteDiscount(parseFloat(e.target.value) || 0)} style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid var(--color-accent)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'rgba(37,99,235,0.2)', borderRadius: '4px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  <span>TOTAL:</span>
                  <span>£{(quoteItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0) * (1 - quoteDiscount / 100)).toFixed(2)}</span>
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
