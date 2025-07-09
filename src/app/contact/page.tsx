export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">צור קשר</h1>
        <p className="text-xl text-center text-gray-600 mb-16">
          נשמח לעזור לכם למצוא את הצימר המושלם
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">טלפון</h3>
                <p className="text-gray-600">050-123-4567</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">אימייל</h3>
                <p className="text-gray-600">info@vilala.co.il</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">שעות פעילות</h3>
                <p className="text-gray-600">ראשון-חמישי: 9:00-18:00</p>
                <p className="text-gray-600">שישי: 9:00-14:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}