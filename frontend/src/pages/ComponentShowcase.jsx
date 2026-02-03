import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Modal from "../components/Modal";
import Input, { Textarea, Select } from "../components/Input";
import Alert from "../components/Alert";
import Badge from "../components/Badge";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { Mail, Star, Settings, User, TrendingUp, Clock } from "lucide-react";

const ComponentShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-gray-600">
            All the beautiful components available in LanditAI
          </p>
        </div>

        {/* Stat Cards */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Stat Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Emails"
              value="1,234"
              icon={Mail}
              trend="up"
              trendValue="12.5%"
              color="indigo"
            />
            <StatCard
              title="Success Rate"
              value="95%"
              icon={Star}
              trend="up"
              trendValue="5%"
              color="green"
            />
            <StatCard
              title="Active Users"
              value="2,567"
              icon={User}
              trend="up"
              trendValue="23%"
              color="blue"
            />
            <StatCard
              title="Avg Response"
              value="24h"
              icon={Clock}
              color="purple"
            />
          </div>
        </section>

        {/* Buttons */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Buttons</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="success">Success</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button icon={Mail} iconPosition="left">
                      With Left Icon
                    </Button>
                    <Button icon={Star} iconPosition="right" variant="outline">
                      With Right Icon
                    </Button>
                    <Button icon={Settings} variant="secondary">
                      Settings
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button loading={loading} onClick={handleLoadingDemo}>
                      {loading ? "Loading..." : "Click to Load"}
                    </Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Badges</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="danger">Danger</Badge>
                    <Badge variant="purple">Purple</Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Basic Card</h3>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600">
                  This is a basic card with header and body.
                </p>
              </Card.Body>
            </Card>

            <Card hover>
              <Card.Header>
                <h3 className="text-lg font-semibold">Hover Card</h3>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600">
                  This card has a hover effect. Try hovering over it!
                </p>
              </Card.Body>
            </Card>

            <Card gradient>
              <Card.Header>
                <h3 className="text-lg font-semibold">Gradient Card</h3>
              </Card.Header>
              <Card.Body>
                <p className="text-gray-600">
                  This card has a subtle gradient background.
                </p>
              </Card.Body>
              <Card.Footer>
                <Button size="sm">Action</Button>
              </Card.Footer>
            </Card>
          </div>
        </section>

        {/* Form Components */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Form Components</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-6 max-w-2xl">
                <Input
                  label="Text Input"
                  placeholder="Enter some text..."
                  icon={User}
                />

                <Input
                  label="Input with Error"
                  placeholder="This has an error"
                  error="This field is required"
                />

                <Textarea
                  label="Textarea"
                  placeholder="Enter multiple lines..."
                  rows={4}
                />

                <Select
                  label="Select Dropdown"
                  options={[
                    { value: "", label: "Choose an option" },
                    { value: "option1", label: "Option 1" },
                    { value: "option2", label: "Option 2" },
                    { value: "option3", label: "Option 3" },
                  ]}
                />
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Alerts */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Alerts</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <Alert
                  type="success"
                  title="Success!"
                  message="Your action was completed successfully."
                />
                <Alert
                  type="error"
                  title="Error Occurred"
                  message="Something went wrong. Please try again."
                />
                <Alert
                  type="warning"
                  title="Warning"
                  message="Please review this information carefully before proceeding."
                />
                <Alert
                  type="info"
                  title="Information"
                  message="Here's some helpful information for you to know."
                />
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Modal */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Modal</h2>
            </Card.Header>
            <Card.Body>
              <Button onClick={() => setShowModal(true)}>
                Open Modal Demo
              </Button>

              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Example Modal"
                size="md"
              >
                <div className="space-y-4">
                  <p className="text-gray-600">
                    This is a modal dialog with smooth animations and
                    accessibility features built-in.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => setShowModal(false)}>Close</Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Modal>
            </Card.Body>
          </Card>
        </section>

        {/* Loading States */}
        <section>
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-bold">Loading States</h2>
            </Card.Header>
            <Card.Body>
              <div className="flex flex-wrap gap-8 items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Small</p>
                  <LoadingSpinner size="sm" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Medium</p>
                  <LoadingSpinner size="md" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Large</p>
                  <LoadingSpinner size="lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Extra Large</p>
                  <LoadingSpinner size="xl" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Usage Tips */}
        <section>
          <Card gradient>
            <Card.Header>
              <h2 className="text-2xl font-bold">💡 Usage Tips</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Import Components:</h3>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm">
                    {`import { Button, Card, Modal } from '../components';`}
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Use Consistently:</h3>
                  <p>
                    Replace all old buttons and cards with these new components
                    throughout the app for a consistent look.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Customize:</h3>
                  <p>
                    All components accept className prop for additional
                    customization if needed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Accessibility:</h3>
                  <p>
                    All components follow WAI-ARIA guidelines and are keyboard
                    navigable.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ComponentShowcase;
