import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { contactService } from '@/services/contactService';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'general' | 'order' | 'payment' | 'product' | 'technical' | 'complaint';
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

interface SupportResponse {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
  adminName?: string;
}

const SupportSystem: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);

  // Form states
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: 'general' as const,
    priority: 'MEDIUM' as const
  });
  
  const [responseMessage, setResponseMessage] = useState('');

  // Simulate loading tickets (replace with actual API call when available)
  const loadTickets = async () => {
    try {
      setLoading(true);
      // Simulated tickets for now - replace with actual API call
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          subject: 'Order delivery question',
          message: 'I have a question about my recent order delivery.',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          category: 'order',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 3600000).toISOString(),
          responses: [
            {
              id: '1',
              message: 'Thank you for contacting us. We are looking into your order.',
              isAdmin: true,
              adminName: 'Support Team',
              createdAt: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        }
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: "Error",
        description: "Failed to load support tickets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  // Create new support ticket using contact service
  const handleCreateTicket = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to create a support ticket.",
        variant: "destructive",
      });
      return;
    }

    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingTicket(true);
      
      // Send contact message via contact service
      const response = await contactService.sendContactMessage({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        subject: newTicket.subject,
        message: newTicket.message,
        category: newTicket.category
      });

      toast({
        title: "Ticket Created",
        description: `Your support ticket has been created. Reference: ${response.reference}`,
      });

      // Reset form and close
      setNewTicket({
        subject: '',
        message: '',
        category: 'general',
        priority: 'MEDIUM'
      });
      setShowCreateForm(false);
      
      // Reload tickets (in real implementation)
      loadTickets();
      
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create support ticket.",
        variant: "destructive",
      });
    } finally {
      setSubmittingTicket(false);
    }
  };

  // Send response to ticket (mock for now)
  const handleSendResponse = async (ticketId: string) => {
    if (!responseMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingResponse(true);
      
      // In real implementation, this would call an API
      // For now, we'll simulate adding a response
      toast({
        title: "Response Sent",
        description: "Your response has been sent to our support team.",
      });
      
      setResponseMessage('');
      
    } catch (error) {
      console.error('Error sending response:', error);
      toast({
        title: "Error",
        description: "Failed to send response.",
        variant: "destructive",
      });
    } finally {
      setSendingResponse(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: SupportTicket['status'] }) => {
    const config = {
      NEW: { color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      RESOLVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CLOSED: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };

    const { color, icon: Icon } = config[status];

    return (
      <Badge className={`${color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: SupportTicket['priority'] }) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[priority]}>
        {priority}
      </Badge>
    );
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sign In for Support</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access customer support and create tickets.
            </p>
            <Button size="lg">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span className="text-lg">Loading support tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Support</h1>
          <p className="text-gray-600 mt-1">
            Get help with your orders, products, and account
          </p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Create Ticket Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value: any) => 
                        setNewTicket(prev => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="order">Order</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value: any) => 
                        setNewTicket(prev => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    placeholder="Brief description of your issue..."
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateTicket}
                    disabled={submittingTicket}
                  >
                    {submittingTicket && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Create Ticket
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    disabled={submittingTicket}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Tickets</h2>
            
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <Card 
                  key={ticket.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedTicket?.id === ticket.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <div className="flex gap-2">
                        <PriorityBadge priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {ticket.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Category: {ticket.category}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
                  <p className="text-gray-600 mb-4">
                    You don't have any support tickets yet.
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Ticket Details/Chat */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                <div className="flex gap-2">
                  <StatusBadge status={selectedTicket.status} />
                  <PriorityBadge priority={selectedTicket.priority} />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Original Message */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">
                    You • {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                  <p className="text-sm">{selectedTicket.message}</p>
                </div>

                {/* Responses */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.responses.map((response) => (
                    <div 
                      key={response.id}
                      className={`p-3 rounded-lg ${
                        response.isAdmin ? 'bg-blue-50 ml-4' : 'bg-gray-50 mr-4'
                      }`}
                    >
                      <div className="text-sm text-gray-600 mb-1">
                        {response.isAdmin ? response.adminName : 'You'} • {' '}
                        {new Date(response.createdAt).toLocaleString()}
                      </div>
                      <p className="text-sm">{response.message}</p>
                    </div>
                  ))}
                </div>

                {/* Response Form */}
                {selectedTicket.status !== 'CLOSED' && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your response..."
                      rows={3}
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                    />
                    <Button 
                      onClick={() => handleSendResponse(selectedTicket.id)}
                      disabled={sendingResponse || !responseMessage.trim()}
                      size="sm"
                      className="w-full"
                    >
                      {sendingResponse && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Ticket</h3>
                <p className="text-gray-600">
                  Choose a ticket from the list to view details and responses.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportSystem;
