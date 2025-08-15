import React, { useState } from 'react';
import { Send, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'PRODUCT' | 'TECHNICAL' | 'OTHER';
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

interface SupportSystemProps {
  tickets: SupportTicket[];
  onCreateTicket: (ticket: {
    subject: string;
    message: string;
    category: string;
    priority: string;
  }) => Promise<void>;
  onSendResponse: (ticketId: string, message: string) => Promise<void>;
}

const SupportSystem: React.FC<SupportSystemProps> = ({ 
  tickets, 
  onCreateTicket, 
  onSendResponse 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: '',
    priority: 'MEDIUM'
  });
  const [responseMessage, setResponseMessage] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="h-4 w-4" />;
      case 'IN_PROGRESS': return <AlertCircle className="h-4 w-4" />;
      case 'RESOLVED': return <CheckCircle className="h-4 w-4" />;
      case 'CLOSED': return <CheckCircle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim() || !newTicket.category) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await onCreateTicket(newTicket);
      setNewTicket({ subject: '', message: '', category: '', priority: 'MEDIUM' });
      setShowCreateForm(false);
      
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive"
      });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    try {
      await onSendResponse(selectedTicket, responseMessage);
      setResponseMessage('');
      
      toast({
        title: "Response Sent",
        description: "Your message has been sent to support",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive"
      });
    }
  };

  const selectedTicketData = tickets.find(t => t.id === selectedTicket);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Customer Support</h2>
            <p className="text-gray-600 mb-4">Please login to access customer support</p>
            <Button>Login to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tickets List */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Support Tickets
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowCreateForm(true)}
                  >
                    New Ticket
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">No support tickets yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedTicket === ticket.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTicket(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {ticket.subject}
                          </h4>
                          {getStatusIcon(ticket.status)}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(ticket.priority)}`}
                          >
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                        
                        {ticket.responses.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {ticket.responses.length} response(s)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ticket Details / Create Form */}
          <div className="lg:w-2/3">
            {showCreateForm ? (
              /* Create New Ticket Form */
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <Select 
                        value={newTicket.category} 
                        onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ORDER">Order Issues</SelectItem>
                          <SelectItem value="PAYMENT">Payment Problems</SelectItem>
                          <SelectItem value="PRODUCT">Product Questions</SelectItem>
                          <SelectItem value="TECHNICAL">Technical Support</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <Select 
                        value={newTicket.priority} 
                        onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
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
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <Input
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <Textarea
                      value={newTicket.message}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {newTicket.message.length}/1000 characters
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateTicket}>
                      Create Ticket
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedTicketData ? (
              /* Ticket Details */
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedTicketData.subject}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(selectedTicketData.status)}>
                          {selectedTicketData.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(selectedTicketData.priority)}>
                          {selectedTicketData.priority}
                        </Badge>
                        <Badge variant="secondary">
                          {selectedTicketData.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(null)}
                    >
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Original Message */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">You</span>
                      <span className="text-sm text-gray-600">
                        {new Date(selectedTicketData.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{selectedTicketData.message}</p>
                  </div>

                  {/* Responses */}
                  <div className="space-y-4 mb-6">
                    {selectedTicketData.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-4 rounded-lg ${
                          response.isAdmin 
                            ? 'bg-blue-50 border-l-4 border-blue-400' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {response.isAdmin ? (response.adminName || 'Support Team') : 'You'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(response.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{response.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Response Form */}
                  {['OPEN', 'IN_PROGRESS'].includes(selectedTicketData.status) && (
                    <div className="space-y-4">
                      <Textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Type your response..."
                        rows={4}
                      />
                      <Button 
                        onClick={handleSendResponse}
                        disabled={!responseMessage.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Response
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Empty State */
              <Card>
                <CardContent className="py-16 text-center">
                  <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a ticket to view details
                  </h3>
                  <p className="text-gray-600">
                    Choose a support ticket from the list to view conversation history
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSystem;
