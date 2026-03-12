<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            <div class="flex items-center gap-2">
                <span>🐛</span>
                GitHub Issues
                @if($count > 0)
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {{ $count }} open
                    </span>
                @else
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        All clear
                    </span>
                @endif
            </div>
        </x-slot>

        @if($error)
            <p class="text-sm text-red-500">{{ $error }}</p>
        @elseif(empty($issues))
            <p class="text-sm text-gray-500 dark:text-gray-400">No open issues 🎉</p>
        @else
            <div class="divide-y divide-gray-100 dark:divide-gray-800">
                @foreach($issues as $issue)
                    <div class="py-3 flex items-start justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <a href="{{ $issue['html_url'] }}" target="_blank"
                                   style="color: #10b981; text-decoration: underline; font-size: 0.875rem; font-weight: 500;">
                                    #{{ $issue['number'] }} {{ $issue['title'] }}
                                </a>
                                @php $state = $issue['state'] ?? 'open'; @endphp
                                <span style="
                                    display: inline-flex; align-items: center;
                                    padding: 1px 8px; border-radius: 9999px;
                                    font-size: 0.7rem; font-weight: 600;
                                    background-color: {{ $state === 'open' ? '#16a34a22' : '#7c3aed22' }};
                                    color: {{ $state === 'open' ? '#16a34a' : '#7c3aed' }};
                                ">
                                    {{ $state === 'open' ? '● open' : '✓ closed' }}
                                </span>
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                opened {{ \Carbon\Carbon::parse($issue['created_at'])->diffForHumans() }}
                                by <span class="font-medium">{{ $issue['user']['login'] }}</span>
                            </p>
                        </div>
                        @if(!empty($issue['labels']))
                            <div class="flex flex-wrap gap-1 shrink-0">
                                @foreach($issue['labels'] as $label)
                                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                                          style="background-color: #{{ $label['color'] }}33; color: #{{ $label['color'] }};">
                                        {{ $label['name'] }}
                                    </span>
                                @endforeach
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        @endif
    </x-filament::section>
</x-filament-widgets::widget>
