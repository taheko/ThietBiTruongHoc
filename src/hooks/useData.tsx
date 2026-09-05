import { useEffect, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Asset,
  Category,
  Location,
  InventorySession,
  InventoryItem,
  Transfer,
  Repair,
  Disposal,
  AIReport,
  AssetCondition,
  AssetStatus
} from '@/types/database';

interface DataContextValue {
  assets: Asset[];
  categories: Category[];
  locations: Location[];
  sessions: InventorySession[];
  inventoryItems: InventoryItem[];
  transfers: Transfer[];
  repairs: Repair[];
  disposals: Disposal[];
  aiReports: AIReport[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function parseAssetCondition(item: any): AssetCondition {
  const note = item.condition_note || '';
  if (note.includes('[Tình trạng: Mới]')) return 'new';
  if (note.includes('[Tình trạng: Hư hỏng nhẹ]')) return 'damaged';
  if (note.includes('[Tình trạng: Hỏng]')) return 'broken';
  if (note.includes('[Tình trạng: Mất]')) return 'lost';
  if (note.includes('[Tình trạng: Tốt]')) return 'good';

  if (item.condition) {
    const c = String(item.condition).toLowerCase();
    if (['new', 'good', 'damaged', 'broken', 'lost'].includes(c)) return c as AssetCondition;
  }
  if (item.status === 'damaged') return 'damaged';
  if (item.status === 'missing') return 'lost';
  return 'good';
}

export function parseAssetStatus(item: any): AssetStatus {
  const note = item.condition_note || '';
  if (item.status === 'disposed') return 'disposed';
  if (item.status === 'under_repair') return 'under_repair';

  if (note.includes('[Trạng thái: Đã điều chuyển]')) return 'transferred';
  if (note.includes('[Trạng thái: Lưu kho]')) return 'in_storage';
  if (note.includes('[Trạng thái: Đang sửa chữa]')) return 'under_repair';
  if (note.includes('[Trạng thái: Đã thanh lý]')) return 'disposed';
  if (note.includes('[Trạng thái: Đang sử dụng]')) return 'in_use';

  if (item.status === 'in_storage') return 'in_storage';
  if (item.status === 'transferred') return 'transferred';
  if (item.status === 'in_use') return 'in_use';

  return 'in_use';
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sessions, setSessions] = useState<InventorySession[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [disposals, setDisposals] = useState<Disposal[]>([]);
  const [aiReports, setAiReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        assetsRes,
        categoriesRes,
        locationsRes,
        sessionsRes,
        inventoryItemsRes,
        transfersRes,
        repairsRes,
        disposalsRes,
        aiReportsRes,
      ] = await Promise.all([
        supabase.from('assets').select('*, category:categories(*), location:locations(*)').order('code'),
        supabase.from('categories').select('*').order('name'),
        supabase.from('locations').select('*').order('name'),
        supabase.from('inventory_sessions').select('*').order('start_date', { ascending: false }),
        supabase.from('inventory_items').select('*, asset:assets(*), session:inventory_sessions(*)'),
        supabase.from('transfers').select('*, asset:assets(*), from_location:locations!from_location_id(*), to_location:locations!to_location_id(*)').order('transfer_date', { ascending: false }),
        supabase.from('repairs').select('*, asset:assets(*)').order('start_date', { ascending: false }),
        supabase.from('disposals').select('*, asset:assets(*)').order('disposal_date', { ascending: false }),
        supabase.from('ai_reports').select('*').order('created_at', { ascending: false }),
      ]);

      if (assetsRes.error) throw assetsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (locationsRes.error) throw locationsRes.error;
      if (sessionsRes.error) throw sessionsRes.error;
      if (inventoryItemsRes.error) throw inventoryItemsRes.error;
      if (transfersRes.error) throw transfersRes.error;
      if (repairsRes.error) throw repairsRes.error;
      if (disposalsRes.error) throw disposalsRes.error;
      if (aiReportsRes.error) throw aiReportsRes.error;

      const rawAssets = (assetsRes.data || []) as any[];
      const mappedAssets: Asset[] = rawAssets.map((a) => ({
        ...a,
        condition: parseAssetCondition(a),
        status: parseAssetStatus(a),
        serial_number: a.serial_number || (a.code ? `SN-${a.code}` : null),
      }));

      const rawSessions = (sessionsRes.data || []) as any[];
      const mappedSessions: InventorySession[] = rawSessions.map((s) => ({
        ...s,
        title: s.title || s.name || 'Đợt kiểm kê',
        status: s.status === 'open' ? 'in_progress' : s.status,
      }));

      const rawItems = (inventoryItemsRes.data || []) as any[];
      const mappedItems: InventoryItem[] = rawItems.map((i) => {
        const found = i.found !== undefined ? Boolean(i.found) : i.result !== 'missing';
        let condition_observed: AssetCondition = 'good';
        if (i.condition_observed) {
          condition_observed = i.condition_observed;
        } else if (i.result === 'damaged') {
          condition_observed = 'damaged';
        } else if (i.result === 'needs_repair') {
          condition_observed = 'broken';
        } else if (i.result === 'missing') {
          condition_observed = 'lost';
        }

        return {
          ...i,
          found,
          condition_observed,
          expected_location_id: i.expected_location_id || i.asset?.location_id || null,
          actual_location_id: i.actual_location_id || i.asset?.location_id || null,
          notes: i.notes || i.note || '',
        };
      });

      const rawReports = (aiReportsRes.data || []) as any[];
      const mappedReports: AIReport[] = rawReports.map((r) => ({
        ...r,
        report_type: r.report_type || r.type,
      }));

      setAssets(mappedAssets);
      setCategories((categoriesRes.data || []) as Category[]);
      setLocations((locationsRes.data || []) as Location[]);
      setSessions(mappedSessions);
      setInventoryItems(mappedItems);
      setTransfers((transfersRes.data || []) as Transfer[]);
      setRepairs((repairsRes.data || []) as Repair[]);
      setDisposals((disposalsRes.data || []) as Disposal[]);
      setAiReports(mappedReports);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi tải dữ liệu';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <DataContext.Provider
      value={{
        assets,
        categories,
        locations,
        sessions,
        inventoryItems,
        transfers,
        repairs,
        disposals,
        aiReports,
        loading,
        error,
        reload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
