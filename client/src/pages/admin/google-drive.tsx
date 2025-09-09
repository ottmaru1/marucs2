
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  User,
  Calendar,
  HardDrive,
  AlertTriangle
} from "lucide-react";

interface GoogleDriveAccount {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  storageUsed: string;
  storageTotal: string;
  lastSync: string;
  status: 'active' | 'error' | 'suspended';
}

export default function GoogleDriveAdmin() {
  const [accounts, setAccounts] = useState<GoogleDriveAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();

  // Mock data for demonstration
  useEffect(() => {
    setAccounts([
      {
        id: '1',
        email: 'drive1@marucomsys.com',
        displayName: 'MaruCom Drive 1',
        isActive: true,
        storageUsed: '8.2 GB',
        storageTotal: '15 GB',
        lastSync: '2024-01-20 14:30',
        status: 'active'
      },
      {
        id: '2',
        email: 'drive2@marucomsys.com',
        displayName: 'MaruCom Drive 2',
        isActive: false,
        storageUsed: '12.1 GB',
        storageTotal: '15 GB',
        lastSync: '2024-01-19 09:15',
        status: 'suspended'
      },
      {
        id: '3',
        email: 'drive3@marucomsys.com',
        displayName: 'MaruCom Drive 3',
        isActive: true,
        storageUsed: '4.7 GB',
        storageTotal: '15 GB',
        lastSync: '2024-01-20 16:45',
        status: 'error'
      }
    ]);
  }, []);

  const handleRefreshTokens = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/google-drive/refresh-tokens', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        // Refresh account list
        console.log(`${data.refreshedCount} tokens refreshed`);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleAccount = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/google-drive/accounts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        setAccounts(prev => prev.map(acc => 
          acc.id === id ? { ...acc, isActive } : acc
        ));
      }
    } catch (error) {
      console.error('Account toggle failed:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Google Drive 계정 관리</h1>
          <p className="text-gray-600 mt-1">연결된 Google Drive 계정을 관리하고 모니터링합니다</p>
        </div>
        
        <Button 
          onClick={handleRefreshTokens}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          토큰 갱신
        </Button>
      </div>

      {/* Stats Overview - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 계정</p>
                <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 계정</p>
                <p className="text-2xl font-bold text-green-600">
                  {accounts.filter(acc => acc.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">오류 계정</p>
                <p className="text-2xl font-bold text-red-600">
                  {accounts.filter(acc => acc.status === 'error').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 저장공간</p>
                <p className="text-2xl font-bold text-purple-600">45 GB</p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account List - Mobile Responsive */}
      <div className="space-y-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(account.status)}
                  <div>
                    <CardTitle className="text-lg">{account.displayName}</CardTitle>
                    <p className="text-sm text-gray-600">{account.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(account.status)}>
                    {account.status}
                  </Badge>
                  <Switch
                    checked={account.isActive}
                    onCheckedChange={(checked) => handleToggleAccount(account.id, checked)}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">저장공간:</span>
                  <span className="font-medium">
                    {account.storageUsed} / {account.storageTotal}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">마지막 동기화:</span>
                  <span className="font-medium">{account.lastSync}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${
                    account.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-gray-600">
                    {account.isActive ? '활성' : '비활성'}
                  </span>
                </div>
              </div>
              
              {/* Storage Progress Bar - Mobile Friendly */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>저장공간 사용률</span>
                  <span>
                    {Math.round((parseFloat(account.storageUsed) / parseFloat(account.storageTotal)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round((parseFloat(account.storageUsed) / parseFloat(account.storageTotal)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              연결된 Google Drive 계정이 없습니다
            </h3>
            <p className="text-gray-600">
              새로운 Google Drive 계정을 연결하여 시작하세요
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
