<?php

namespace App\Filament\Admin\Resources\Languages\Pages;

use App\Filament\Admin\Resources\Languages\LanguageResource;
use App\Models\Roadmap;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Facades\Http;

class ViewLanguage extends ViewRecord
{
    protected static string $resource = LanguageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),

            Action::make('regenerate_roadmap')
                ->label(fn () => $this->getRoadmapStatus())
                ->icon('heroicon-o-map')
                ->color('warning')
                ->requiresConfirmation()
                ->modalHeading('Regenerate Roadmap')
                ->modalDescription(fn () => 'This will call the Claude API and replace the existing roadmap for ' . $this->record->name . '. Are you sure?')
                ->modalSubmitActionLabel('Yes, regenerate')
                ->action(function () {
                    $language = $this->record->name;

                    try {
                        $response = Http::timeout(90)->post(
                            config('app.url') . '/api/roadmap/' . urlencode($language) . '/refresh'
                        );

                        if ($response->successful()) {
                            Notification::make()
                                ->title('Roadmap regenerated')
                                ->body("Roadmap for {$language} has been updated successfully.")
                                ->success()
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Failed to regenerate roadmap')
                                ->body('Error: ' . $response->status())
                                ->danger()
                                ->send();
                        }
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('Error')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
        ];
    }

    private function getRoadmapStatus(): string
    {
        $roadmap = Roadmap::where('language', $this->record->name)->first();

        if (! $roadmap) {
            return '✦ Generate Roadmap';
        }

        return '✦ Regenerate Roadmap (' . $roadmap->generated_at->format('d M Y') . ')';
    }
}
